'use client';

import { useEffect, useState } from 'react';
import { signOut } from '@/app/actions/auth';

type TabType = 'new-email' | 'brand' | 'history' | 'user';

export default function DashboardContent() {
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('new-email');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    // Retrieve and clear the pending prompt from localStorage
    const prompt = localStorage.getItem('pendingEmailPrompt');
    if (prompt) {
      setPendingPrompt(prompt);
      setShowPrompt(true);
      setEmailInput(prompt); // Pre-fill the textarea
      localStorage.removeItem('pendingEmailPrompt');
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    setPendingPrompt(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
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
                        <span className="hidden xs:inline">Export to HTML & TSX</span>
                        <span className="xs:hidden">HTML & TSX</span>
                      </div>
                      <button className="w-full sm:w-auto rounded-full bg-white px-5 sm:px-6 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 hover:scale-105 active:scale-100">
                        Generate Email
                      </button>
                    </div>
                  </div>
                </div>

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

              <div className="max-w-2xl space-y-6">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Brand Name</label>
                  <input
                    type="text"
                    placeholder="Your Company Name"
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Industry</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00ffff]">
                    <option value="">Select industry</option>
                    <option>Technology</option>
                    <option>E-commerce</option>
                    <option>Education</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Brand Voice */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Brand Voice</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Professional', 'Friendly', 'Casual', 'Formal'].map((voice) => (
                      <button
                        key={voice}
                        className="px-4 py-2 rounded-lg border border-white/20 text-sm text-white/70 hover:border-[#00ffff] hover:text-white hover:bg-white/5 transition-all"
                      >
                        {voice}
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
                      defaultValue="#00ffff"
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue="#00ffff"
                      className="flex-1 px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                    />
                  </div>
                </div>

                {/* Brand Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Brand Description</label>
                  <textarea
                    placeholder="Describe your brand, products, and target audience..."
                    className="w-full h-32 px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] resize-none"
                  />
                </div>

                <button className="px-6 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl hover:shadow-white/30 transition-all hover:-translate-y-0.5">
                  Save Brand Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Email History</h1>
                <p className="text-sm sm:text-base text-white/60">View and manage your generated emails</p>
              </div>

              {/* Empty state */}
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
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      Sign Out
                    </button>
                  </form>
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
