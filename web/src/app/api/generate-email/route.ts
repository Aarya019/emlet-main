import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmailContent } from '@/lib/ai/gemini';
import { getDefaultBrandProfile } from '@/lib/db/queries';
import { deductCredits } from '@/lib/db/queries';
import { createEmailGeneration } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' }, 
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long (max 1000 characters)' }, 
        { status: 400 }
      );
    }

    // Check user has credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining, plan_type')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits_remaining < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' }, 
        { status: 402 }
      );
    }

    // Get user's brand profile
    const brandProfile = await getDefaultBrandProfile(user.id);

    // Create initial generation record with 'generating' status
    const initialGeneration = await createEmailGeneration({
      user_id: user.id,
      brand_profile_id: brandProfile?.id || null,
      prompt: prompt.trim(),
      email_type: null,
      subject_line: null,
      preview_text: null,
      content_json: null,
      react_code: null,
      html_code: null,
      status: 'generating',
      credits_used: 1,
      error_message: null
    });

    if (!initialGeneration) {
      return NextResponse.json(
        { error: 'Failed to create generation record' }, 
        { status: 500 }
      );
    }

    try {
      // Generate email content with Gemini
      const emailContent = await generateEmailContent(prompt.trim(), brandProfile);

      // Deduct credits (this will fail if insufficient credits)
      const creditsDeducted = await deductCredits(user.id, 1);
      
      if (!creditsDeducted) {
        // Update generation with error
        await supabase
          .from('email_generations')
          .update({
            status: 'failed',
            error_message: 'Failed to deduct credits'
          })
          .eq('id', initialGeneration.id);

        return NextResponse.json(
          { error: 'Failed to deduct credits' }, 
          { status: 500 }
        );
      }

      // Update generation record with completed status
      const { data: completedGeneration, error: updateError } = await supabase
        .from('email_generations')
        .update({
          email_type: emailContent.emailType,
          subject_line: emailContent.subject,
          preview_text: emailContent.previewText,
          content_json: emailContent,
          status: 'completed',
          error_message: null
        })
        .eq('id', initialGeneration.id)
        .select()
        .single();

      if (updateError || !completedGeneration) {
        console.error('Error updating generation:', updateError);
        return NextResponse.json(
          { error: 'Failed to save generated email' }, 
          { status: 500 }
        );
      }

      // Get updated credits
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', user.id)
        .single();

      return NextResponse.json({
        success: true,
        generation: completedGeneration,
        creditsRemaining: updatedProfile?.credits_remaining || 0
      }, { status: 201 });

    } catch (generationError) {
      console.error('Email generation error:', generationError);

      // Update generation with error status
      await supabase
        .from('email_generations')
        .update({
          status: 'failed',
          error_message: generationError instanceof Error ? generationError.message : 'Unknown error'
        })
        .eq('id', initialGeneration.id);

      return NextResponse.json(
        { 
          error: 'Failed to generate email', 
          details: generationError instanceof Error ? generationError.message : 'Unknown error'
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in POST /api/generate-email:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
