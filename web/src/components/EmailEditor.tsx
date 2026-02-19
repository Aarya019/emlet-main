'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EmailGeneration } from '@/lib/db/types';
import type { GeneratedEmail } from '@/lib/ai/gemini';

interface EmailEditorProps {
  emailId: string;
}

export default function EmailEditor({ emailId }: EmailEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<EmailGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    loadEmail();
  }, [emailId]);

  const loadEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/email-generations/${emailId}`);
      
      if (!res.ok) {
        setError('Failed to load email');
        return;
      }

      const data = await res.json();
      setEmail(data.generation);
    } catch (err) {
      console.error('Error loading email:', err);
      setError('An error occurred while loading the email');
    } finally {
      setLoading(false);
    }
  };

  const emailContent = email?.content_json as GeneratedEmail | null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (error || !email || !emailContent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-red-300 mb-6">{error || 'Email not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-white/10"></div>
              <h2 className="text-white font-semibold truncate max-w-md">
                {emailContent?.subject || 'Untitled Email'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setAiChatOpen(!aiChatOpen)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black hover:shadow-lg hover:shadow-[#00ffff]/50 transition-all text-sm font-bold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Edit with AI
              </button>
              <button className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all text-sm font-medium">
                Save Changes
              </button>
              <button 
                onClick={() => {
                  if (!email.html_code) return;
                  const blob = new Blob([email.html_code], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${emailContent.subject?.replace(/[^a-z0-9]/gi, '_') || 'email'}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={!email.html_code}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export HTML
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          
          {/* Preview Panel - LEFT (2/3 width) */}
          <div className="lg:col-span-2 border-r border-white/10">
            <div className="h-[calc(100vh-73px)] overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Live Preview</h3>
                  <p className="text-sm text-white/60">See how your email looks</p>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      previewMode === 'desktop'
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      previewMode === 'mobile'
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Mobile
                  </button>
                </div>
              </div>
              
              <div className={`mx-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
              }`}>
                {email.html_code ? (
                  // Use generated HTML for accurate design-style preview
                  <div className="rounded-lg overflow-hidden shadow-2xl border border-white/20">
                    <iframe
                      srcDoc={email.html_code}
                      title="Email Preview"
                      className="w-full border-0"
                      style={{ height: '700px' }}
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : (
                  // Fallback: manual render from JSON
                  <div className="bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-black">
                    <div className="p-8 space-y-6">
                      <div className="text-xs text-gray-500 border-b border-gray-200 pb-4">
                        <div className="font-bold text-gray-900 mb-1">{emailContent.subject}</div>
                        <div>{emailContent.previewText}</div>
                      </div>
                      {emailContent.sections.map((section, index) => (
                        <div key={index} className="space-y-3">
                          {section.type === 'hero' && (
                            <div className="text-center">
                              {section.imageUrl && <img src={section.imageUrl} alt={section.imageAlt} className="w-full mb-4 rounded" />}
                              {section.heading && <h1 className="text-3xl font-black text-gray-900 mb-2">{section.heading}</h1>}
                              {section.subheading && <p className="text-lg text-gray-600">{section.subheading}</p>}
                            </div>
                          )}
                          {section.type === 'content' && (
                            <div>
                              {section.heading && <h2 className="text-2xl font-black text-gray-900 mb-2">{section.heading}</h2>}
                              {section.text && <p className="text-gray-700 leading-relaxed">{section.text}</p>}
                            </div>
                          )}
                          {section.type === 'cta' && (
                            <div className="text-center py-6">
                              {section.heading && <h3 className="text-xl font-black text-gray-900 mb-2">{section.heading}</h3>}
                              {section.text && <p className="text-gray-600 mb-4">{section.text}</p>}
                              {section.buttonText && (
                                <a href={section.buttonUrl || '#'} className="inline-block px-8 py-4 bg-black text-white font-bold text-lg rounded">
                                  {section.buttonText}
                                </a>
                              )}
                            </div>
                          )}
                          {section.type === 'footer' && (
                            <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                              {section.text && <p>{section.text}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Editor Panel - RIGHT (1/3 width) */}
          <div className="lg:col-span-1 relative">
            <div className="h-[calc(100vh-73px)] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Content Editor</h2>
                  <p className="text-sm text-white/60">Edit email sections manually</p>
                </div>
                <button className="text-sm text-[#00ffff] hover:text-[#00ffff]/80 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Section
                </button>
              </div>

              {/* Subject Line */}
              <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                <label className="block text-xs font-medium text-white/40 mb-2">Subject Line</label>
                <input
                  type="text"
                  defaultValue={emailContent.subject}
                  className="w-full px-0 py-1 bg-transparent border-0 text-white text-lg font-semibold focus:outline-none focus:ring-0 placeholder-white/30"
                  placeholder="Enter subject line..."
                />
              </div>

              {/* Preview Text */}
              <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                <label className="block text-xs font-medium text-white/40 mb-2">Preview Text</label>
                <input
                  type="text"
                  defaultValue={emailContent.previewText}
                  className="w-full px-0 py-1 bg-transparent border-0 text-white focus:outline-none focus:ring-0 placeholder-white/30"
                  placeholder="Enter preview text..."
                />
              </div>

              {/* Sections */}
              <div className="space-y-3">
                {emailContent.sections.map((section, index) => (
                  <div key={index} className="group rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between p-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#00ffff]/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#00ffff]">{index + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-white/60 uppercase tracking-wide">{section.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                        <button className="p-1 text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {section.heading && (
                        <div>
                          <label className="block text-xs text-white/40 mb-1.5">Heading</label>
                          <input
                            type="text"
                            defaultValue={section.heading}
                            className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white text-lg font-bold focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                            placeholder="Enter heading..."
                          />
                        </div>
                      )}

                      {section.subheading && (
                        <div>
                          <label className="block text-xs text-white/40 mb-1.5">Subheading</label>
                          <input
                            type="text"
                            defaultValue={section.subheading}
                            className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                            placeholder="Enter subheading..."
                          />
                        </div>
                      )}

                      {section.text && (
                        <div>
                          <label className="block text-xs text-white/40 mb-1.5">Content</label>
                          <textarea
                            defaultValue={section.text}
                            rows={3}
                            className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20"
                            placeholder="Enter content..."
                          />
                        </div>
                      )}

                      {section.buttonText && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-white/40 mb-1.5">Button Text</label>
                            <input
                              type="text"
                              defaultValue={section.buttonText}
                              className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                              placeholder="Click here"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1.5">Button URL</label>
                            <input
                              type="text"
                              defaultValue={section.buttonUrl}
                              className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      )}

                      {section.imageUrl && (
                        <div>
                          <label className="block text-xs text-white/40 mb-1.5">Image URL</label>
                          <input
                            type="text"
                            defaultValue={section.imageUrl}
                            className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                            placeholder="https://..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Panel - OVERLAY */}
            {aiChatOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 animate-in fade-in duration-300"
                  onClick={() => setAiChatOpen(false)}
                />
                
                {/* AI Chat Overlay */}
                <div className="absolute inset-0 bg-black border-l border-white/10 z-20 animate-in slide-in-from-right duration-300">
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          AI Assistant
                        </h3>
                        <button 
                          onClick={() => setAiChatOpen(false)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-white/60">
                        Ask AI to modify your email content
                      </p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Welcome message */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-sm text-white mb-2">
                              Hi! I can help you edit your email. Try asking me to:
                            </p>
                            <ul className="space-y-1 text-xs text-white/70">
                              <li>• Make the tone more casual</li>
                              <li>• Shorten the content</li>
                              <li>• Add urgency to the CTA</li>
                              <li>• Change the hero heading</li>
                            </ul>
                          </div>
                          <p className="text-xs text-white/40 mt-1">Just now</p>
                        </div>
                      </div>

                      {/* Quick suggestions */}
                      <div className="space-y-2">
                        <p className="text-xs text-white/40 font-medium">Quick suggestions:</p>
                        {[
                          'Make it more professional',
                          'Add a discount code section',
                          'Shorten the hero text',
                          'Make CTA more urgent'
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            className="w-full text-left px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#00ffff]/50 transition-all text-sm text-white/70 hover:text-white"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiMessage}
                          onChange={(e) => setAiMessage(e.target.value)}
                          placeholder="Ask AI to modify your email..."
                          className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && aiMessage.trim()) {
                              console.log('Send:', aiMessage);
                            }
                          }}
                        />
                        <button className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-medium hover:shadow-lg hover:shadow-[#00ffff]/50 transition-all flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
