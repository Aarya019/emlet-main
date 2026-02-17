'use client';

import { useEffect, useState } from 'react';
import { signOut } from '@/app/actions/auth';
import type { BrandProfile, BrandVoice, EmailGeneration } from '@/lib/db/types';

type TabType = 'new-email' | 'brand' | 'history' | 'user';

export default function DashboardContent() {
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('new-email');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  
  // Brand profile state
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandSaving, setBrandSaving] = useState(false);
  const [brandMessage, setBrandMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [brandForm, setBrandForm] = useState({
    brand_name: '',
    industry: '',
    brand_voice: 'professional' as BrandVoice,
    primary_color: '#5c5cf0',
    secondary_color: '',
    brand_description: '',
    website_url: '',
    logo_url: ''
  });
  const [analyzingWebsite, setAnalyzingWebsite] = useState(false);

  // Email generation state
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<EmailGeneration | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);

  // History state
  const [emailHistory, setEmailHistory] = useState<EmailGeneration[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    // Retrieve and clear the pending prompt from localStorage
    const prompt = localStorage.getItem('pendingEmailPrompt');
    if (prompt) {
      setPendingPrompt(prompt);
      setShowPrompt(true);
      setEmailInput(prompt); // Pre-fill the textarea
      localStorage.removeItem('pendingEmailPrompt');
    }
    
    // Load brand profile and user stats
    loadBrandProfile();
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      if (res.ok) {
        const data = await res.json();
        setCreditsRemaining(data.credits_remaining);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadEmailHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/email-generations');
      if (res.ok) {
        const data = await res.json();
        setEmailHistory(data.generations || []);
      }
    } catch (error) {
      console.error('Error loading email history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadBrandProfile = async () => {
    setBrandLoading(true);
    try {
      const res = await fetch('/api/brand-profiles');
      if (res.ok) {
        const data = await res.json();
        // Get the default brand profile or the first one
        const profile = data.profiles?.find((p: BrandProfile) => p.is_default) || data.profiles?.[0];
        if (profile) {
          setBrandProfile(profile);
          setBrandForm({
            brand_name: profile.brand_name,
            industry: profile.industry || '',
            brand_voice: profile.brand_voice,
            primary_color: profile.primary_color,
            secondary_color: profile.secondary_color || '',
            brand_description: profile.brand_description || '',
            website_url: profile.website_url || '',
            logo_url: profile.logo_url || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading brand profile:', error);
    } finally {
      setBrandLoading(false);
    }
  };

  const analyzeBrandWebsite = async () => {
    if (!brandForm.website_url.trim()) {
      setBrandMessage({ type: 'error', text: 'Please enter a website URL first' });
      setTimeout(() => setBrandMessage(null), 3000);
      return;
    }

    setAnalyzingWebsite(true);
    setBrandMessage(null);

    try {
      const res = await fetch('/api/analyze-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: brandForm.website_url
        })
      });

      if (res.ok) {
        const { data } = await res.json();
        
        // Auto-fill the form with analyzed data
        setBrandForm({
          ...brandForm,
          brand_name: data.brandName || brandForm.brand_name,
          industry: data.industry || brandForm.industry,
          brand_voice: data.brandVoice || brandForm.brand_voice,
          primary_color: data.primaryColor || brandForm.primary_color,
          secondary_color: data.secondaryColor || brandForm.secondary_color,
          brand_description: data.brandDescription || brandForm.brand_description,
          logo_url: data.logoUrl || brandForm.logo_url
        });

        setBrandMessage({ type: 'success', text: 'Brand details extracted successfully!' });
        setTimeout(() => setBrandMessage(null), 5000);
      } else {
        const error = await res.json();
        setBrandMessage({ type: 'error', text: error.error || 'Failed to analyze website' });
        setTimeout(() => setBrandMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      setBrandMessage({ type: 'error', text: 'An error occurred while analyzing the website' });
      setTimeout(() => setBrandMessage(null), 5000);
    } finally {
      setAnalyzingWebsite(false);
    }
  };

  const saveBrandProfile = async () => {
    setBrandSaving(true);
    setBrandMessage(null);
    
    try {
      const url = brandProfile 
        ? `/api/brand-profiles/${brandProfile.id}` 
        : '/api/brand-profiles';
      
      const method = brandProfile ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandForm,
          is_default: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBrandProfile(data.profile);
        setBrandMessage({ type: 'success', text: 'Brand profile saved successfully!' });
        setTimeout(() => setBrandMessage(null), 3000);
      } else {
        const error = await res.json();
        setBrandMessage({ type: 'error', text: error.error || 'Failed to save brand profile' });
      }
    } catch (error) {
      console.error('Error saving brand profile:', error);
      setBrandMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setBrandSaving(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailInput.trim()) {
      setGenerationError('Please enter a prompt');
      return;
    }

    if (creditsRemaining !== null && creditsRemaining < 1) {
      setGenerationError('Insufficient credits. Please upgrade your plan.');
      return;
    }

    setGenerating(true);
    setGenerationError(null);
    setGeneratedEmail(null);

    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: emailInput.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        setGenerationError(data.error || 'Failed to generate email');
        return;
      }

      // Success
      setGeneratedEmail(data.generation);
      setCreditsRemaining(data.creditsRemaining);
      setEmailInput(''); // Clear input
      
      // Reload history to show new email
      loadEmailHistory();
      
      // Redirect to email editor page
      window.location.href = `/dashboard/email/${data.generation.id}`;
      
    } catch (error) {
      console.error('Error generating email:', error);
      setGenerationError('An error occurred while generating email');
    } finally {
      setGenerating(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setPendingPrompt(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
    
    // Load history when switching to history tab
    if (tab === 'history' && emailHistory.length === 0) {
      loadEmailHistory();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-black border-r border-white/10 transform transition-all duration-500 ease-in-out hover:w-64 w-16 group ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                e
              </span>
              <span className="text-lg font-semibold text-white whitespace-nowrap overflow-hidden lg:group-hover:opacity-100 lg:opacity-0 transition-all duration-500 ease-in-out lg:group-hover:max-w-xs lg:max-w-0">
                emlet
              </span>
            </div>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* New Email */}
            <button
              onClick={() => handleTabChange('new-email')}
              className={`w-full flex items-center gap-3 lg:justify-start lg:group-hover:justify-start justify-start py-3 lg:px-2 lg:group-hover:px-4 px-4 rounded-lg transition-all relative ${
                activeTab === 'new-email'
                  ? 'lg:bg-transparent lg:group-hover:bg-white bg-white lg:text-[#00ffff] lg:group-hover:text-black text-black font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#00ffff] before:rounded-r lg:before:block before:hidden lg:group-hover:before:hidden before:shadow-lg before:shadow-[#00ffff]/50'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              title="New Email"
            >
              <svg className="w-5 h-5 flex-shrink-0 lg:mx-auto lg:group-hover:mx-0 transition-all duration-500 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="whitespace-nowrap lg:max-w-0 lg:group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-in-out">New Email</span>
            </button>

            {/* Brand */}
            <button
              onClick={() => handleTabChange('brand')}
              className={`w-full flex items-center gap-3 lg:justify-start lg:group-hover:justify-start justify-start py-3 lg:px-2 lg:group-hover:px-4 px-4 rounded-lg transition-all relative ${
                activeTab === 'brand'
                  ? 'lg:bg-transparent lg:group-hover:bg-white bg-white lg:text-[#00ffff] lg:group-hover:text-black text-black font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#00ffff] before:rounded-r lg:before:block before:hidden lg:group-hover:before:hidden before:shadow-lg before:shadow-[#00ffff]/50'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              title="Brand"
            >
              <svg className="w-5 h-5 flex-shrink-0 lg:mx-auto lg:group-hover:mx-0 transition-all duration-500 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="whitespace-nowrap lg:max-w-0 lg:group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-in-out">Brand</span>
            </button>

            {/* History */}
            <button
              onClick={() => handleTabChange('history')}
              className={`w-full flex items-center gap-3 lg:justify-start lg:group-hover:justify-start justify-start py-3 lg:px-2 lg:group-hover:px-4 px-4 rounded-lg transition-all relative ${
                activeTab === 'history'
                  ? 'lg:bg-transparent lg:group-hover:bg-white bg-white lg:text-[#00ffff] lg:group-hover:text-black text-black font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#00ffff] before:rounded-r lg:before:block before:hidden lg:group-hover:before:hidden before:shadow-lg before:shadow-[#00ffff]/50'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              title="History"
            >
              <svg className="w-5 h-5 flex-shrink-0 lg:mx-auto lg:group-hover:mx-0 transition-all duration-500 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="whitespace-nowrap lg:max-w-0 lg:group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-in-out">History</span>
            </button>
          </nav>

          {/* User section at bottom */}
          <div className="border-t border-white/10">
            <button
              onClick={() => handleTabChange('user')}
              className={`w-full flex items-center gap-3 lg:justify-start lg:group-hover:justify-start justify-start py-4 lg:px-2 lg:group-hover:px-4 px-4 transition-all relative ${
                activeTab === 'user'
                  ? 'lg:bg-transparent lg:group-hover:bg-white/10 bg-white/10 lg:text-[#00ffff] text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-10 before:bg-[#00ffff] before:rounded-r lg:before:block before:hidden lg:group-hover:before:hidden before:shadow-lg before:shadow-[#00ffff]/50'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              title="Settings"
            >
              <div className="w-8 h-8 flex-shrink-0 lg:mx-auto lg:group-hover:mx-0 transition-all duration-500 ease-in-out rounded-full bg-gradient-to-br from-[#00ff00] via-[#00ffff] to-[#ff00ff] flex items-center justify-center text-black font-semibold text-sm">
                U
              </div>
              <div className="flex-1 text-left lg:max-w-0 lg:group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-in-out">
                <p className="text-sm font-medium whitespace-nowrap">Settings</p>
                <p className="text-xs text-white/50 whitespace-nowrap">Account & Billing</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:ml-16 relative">
        {/* Animated gradient blobs background - only for new-email tab */}
        {activeTab === 'new-email' && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 min-h-full z-0">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#00ff00]/20 via-[#00ffff]/20 to-[#ff00ff]/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-[#ff00ff]/20 via-[#00ffff]/20 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-br from-[#00ffff]/20 via-[#ff00ff]/20 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-[#00ff00]/20 via-[#ff00ff]/20 to-[#00ffff]/20 rounded-full blur-3xl animate-blob animation-delay-6000" />
          </div>
        )}

        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-medium">
            {activeTab === 'new-email' && 'New Email'}
            {activeTab === 'brand' && 'Brand'}
            {activeTab === 'history' && 'History'}
            {activeTab === 'user' && 'Settings'}
          </span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 relative z-10">
          {/* Tab content */}
          {activeTab === 'new-email' && (
            <div className="space-y-6 pt-12 sm:pt-16 lg:pt-24 relative z-10">
              {/* Email Generator - Homepage Style */}
              <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center space-y-2 md:space-y-3 mb-6 md:mb-8">
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    Create better emails, faster.
                  </h2>
                  <p className="text-base text-white/70 sm:text-lg md:text-xl">
                    Generate and send engaging emails in minutes.
                  </p>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff00] via-[#00ffff] to-[#ff00ff] rounded-xl sm:rounded-2xl opacity-80 group-hover:opacity-100 blur transition duration-500 animate-gradient bg-[length:200%_auto]" />
                  <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-black/80 p-1 sm:p-1.5 shadow-2xl backdrop-blur-sm">
                    <textarea
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Describe the email you want to create... (e.g., Product launch announcement with 30% discount)"
                      className="w-full resize-none rounded-lg sm:rounded-xl border-0 bg-black/60 px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:text-white min-h-[140px] sm:min-h-[160px]"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60 justify-center sm:justify-start">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-[#00ffff]">AI-powered</span>
                        </span>
                        <span className="text-white/30">·</span>
                        <span className="hidden xs:inline">
                          {creditsRemaining !== null ? `${creditsRemaining} credits left` : 'Loading...'}
                        </span>
                      </div>
                      <button 
                        onClick={handleGenerateEmail}
                        disabled={generating || !emailInput.trim() || (creditsRemaining !== null && creditsRemaining < 1)}
                        className="w-full sm:w-auto rounded-full bg-white px-5 sm:px-6 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
                      >
                        {generating ? 'Generating...' : 'Generate Email'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {generationError && (
                  <div className="max-w-4xl mx-auto mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                    {generationError}
                  </div>
                )}

                {/* Success Message */}
                {generatedEmail && !generating && (
                  <div className="max-w-4xl mx-auto mt-4 p-4 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
                    Email generated successfully! Check the History tab to view it.
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 justify-center mt-6">
                  <span className="text-xs sm:text-sm text-white/60 w-full sm:w-auto text-center">Try:</span>
                  {[
                    'Product launch announcement',
                    'Customer follow-up',
                    'Holiday promotion',
                    'Newsletter welcome'
                  ].map((prompt, i) => (
                    <button
                      key={prompt}
                      className="rounded-full border border-white/20 bg-black/60 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white/70 transition-all duration-300 hover:border-[#00ffff] hover:bg-black/80 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00ffff]/40"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
                <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1">Total Emails</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-white">0</p>
                </div>

                <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1">This Month</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-white">0</p>
                </div>

                <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1">Templates</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-white">3</p>
                </div>
              </div>

              {/* Quick templates */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Quick Start Templates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { title: 'Product Launch', desc: 'Announce new products', icon: '🚀' },
                    { title: 'Newsletter', desc: 'Weekly/monthly updates', icon: '📧' },
                    { title: 'Promotion', desc: 'Sales and discounts', icon: '💰' },
                    { title: 'Welcome Email', desc: 'Onboard new users', icon: '👋' },
                    { title: 'Thank You', desc: 'Customer appreciation', icon: '🙏' },
                    { title: 'Event Invite', desc: 'Webinars and events', icon: '📅' }
                  ].map((template) => (
                    <button
                      key={template.title}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                    >
                      <div className="text-2xl mb-2">{template.icon}</div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-[#00ffff] transition-colors">{template.title}</h4>
                      <p className="text-xs text-white/60">{template.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Brand Profile</h1>
                <p className="text-sm sm:text-base text-white/60">Customize your brand identity for AI-generated emails</p>
              </div>

              {brandLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]"></div>
                </div>
              ) : (
                <div className="max-w-2xl space-y-6">
                  {/* Success/Error Message */}
                  {brandMessage && (
                    <div className={`p-4 rounded-lg border ${
                      brandMessage.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      {brandMessage.text}
                    </div>
                  )}

                  {/* Website URL with Auto-fill */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Website URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={brandForm.website_url}
                        onChange={(e) => setBrandForm({ ...brandForm, website_url: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                      />
                      <button
                        type="button"
                        onClick={analyzeBrandWebsite}
                        disabled={analyzingWebsite || !brandForm.website_url.trim()}
                        className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-medium hover:shadow-lg hover:shadow-[#00ffff]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                      >
                        {analyzingWebsite ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Auto-fill
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-white/40">We'll automatically extract your brand colors, logo, and voice</p>
                  </div>

                  {/* Brand Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Brand Name *</label>
                    <input
                      type="text"
                      placeholder="Your Company Name"
                      value={brandForm.brand_name}
                      onChange={(e) => setBrandForm({ ...brandForm, brand_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Industry</label>
                    <select 
                      value={brandForm.industry}
                      onChange={(e) => setBrandForm({ ...brandForm, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Brand Voice */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Brand Voice</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['professional', 'friendly', 'casual', 'formal'] as BrandVoice[]).map((voice) => (
                        <button
                          key={voice}
                          type="button"
                          onClick={() => setBrandForm({ ...brandForm, brand_voice: voice })}
                          className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                            brandForm.brand_voice === voice
                              ? 'border-[#00ffff] bg-[#00ffff]/10 text-white'
                              : 'border-white/20 text-white/70 hover:border-[#00ffff] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {voice.charAt(0).toUpperCase() + voice.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Colors */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={brandForm.primary_color}
                        onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandForm.primary_color}
                        onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                      />
                    </div>
                  </div>

                  {/* Brand Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Brand Description</label>
                    <textarea
                      placeholder="Describe your brand, products, and target audience..."
                      value={brandForm.brand_description}
                      onChange={(e) => setBrandForm({ ...brandForm, brand_description: e.target.value })}
                      className="w-full h-32 px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] resize-none"
                    />
                  </div>

                  <button 
                    onClick={saveBrandProfile}
                    disabled={brandSaving || !brandForm.brand_name}
                    className="px-6 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl hover:shadow-white/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {brandSaving ? 'Saving...' : 'Save Brand Profile'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Email History</h1>
                <p className="text-sm sm:text-base text-white/60">View and manage your generated emails</p>
              </div>

              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]"></div>
                </div>
              ) : emailHistory.length === 0 ? (
                /* Empty state */
                <div className="p-12 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white">No emails yet</h2>
                  <p className="text-white/60 mb-6">Your generated emails will appear here</p>
                  <button
                    onClick={() => handleTabChange('new-email')}
                    className="px-6 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl hover:shadow-white/30 transition-all hover:-translate-y-0.5"
                  >
                    Create Your First Email
                  </button>
                </div>
              ) : (
                /* Email grid with previews */
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {emailHistory.map((email) => {
                    const content = email.content_json as any;
                    const firstSection = content?.sections?.[0];
                    
                    return (
                      <div
                        key={email.id}
                        onClick={() => window.location.href = `/dashboard/email/${email.id}`}
                        className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#00ffff]/50 hover:shadow-lg hover:shadow-[#00ffff]/20 transition-all"
                      >
                        {/* Preview thumbnail */}
                        <div className="relative aspect-video bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                          <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                            {firstSection?.heading ? (
                              <h3 className="text-white text-lg font-bold line-clamp-2 mb-2">
                                {firstSection.heading}
                              </h3>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            {firstSection?.subheading && (
                              <p className="text-white/60 text-sm line-clamp-2">
                                {firstSection.subheading}
                              </p>
                            )}
                          </div>
                          
                          {/* Status badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              email.status === 'completed' 
                                ? 'bg-green-500/90 text-white' 
                                : email.status === 'failed'
                                ? 'bg-red-500/90 text-white'
                                : 'bg-yellow-500/90 text-white'
                            }`}>
                              {email.status}
                            </span>
                          </div>
                        </div>

                        {/* Email info */}
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-1 truncate group-hover:text-[#00ffff] transition-colors">
                            {email.subject_line || 'Untitled Email'}
                          </h3>
                          {email.preview_text && (
                            <p className="text-sm text-white/60 mb-3 line-clamp-2">
                              {email.preview_text}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-white/40">
                            <span>
                              {new Date(email.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {email.email_type && (
                              <span className="capitalize px-2 py-0.5 rounded bg-white/5">
                                {email.email_type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'user' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Account Settings</h1>
                <p className="text-sm sm:text-base text-white/60">Manage your account and billing</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Account Section */}
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                      <p className="text-white">user@example.com</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1">Member Since</label>
                      <p className="text-white">February 2026</p>
                    </div>
                  </div>
                </div>

                {/* Billing Section */}
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Billing & Plan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1">Current Plan</label>
                      <p className="text-white font-medium">Free Trial</p>
                    </div>
                    <button className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/5 transition-all">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                {/* Session Section */}
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Session</h3>
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                  <button className="px-6 py-2.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
