'use client';

import { useEffect, useState } from 'react';
import { signOut } from '@/app/actions/auth';
import type { BrandProfile, BrandVoice, EmailGeneration, DesignStyle } from '@/lib/db/types';
import EmailGeneratingOverlay from '@/components/EmailGeneratingOverlay';

function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/paddle/portal', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to get portal URL');
      const { url } = await res.json();
      if (url) window.open(url, '_blank');
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/5 transition-all text-sm disabled:opacity-50"
    >
      {loading ? 'Loading…' : 'Manage Billing'}
    </button>
  );
}

type TabType = 'new-email' | 'brand' | 'history' | 'user';

export default function DashboardContent() {
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('new-email');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [designStyle, setDesignStyle] = useState<DesignStyle>('minimalist');
  
  // Brand profile state
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile | null>(null);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandSaving, setBrandSaving] = useState(false);
  const [brandMessage, setBrandMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
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
  const [planType, setPlanType] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [userEmail, setUserEmail] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');
  const [totalEmails, setTotalEmails] = useState<number>(0);

  // History state
  const [emailHistory, setEmailHistory] = useState<EmailGeneration[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Brand delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<{ id: string; name: string } | null>(null);

  // Email delete state
  const [emailToDelete, setEmailToDelete] = useState<EmailGeneration | null>(null);
  const [deletingEmailId, setDeletingEmailId] = useState<string | null>(null);

  // Design style dropdown
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  // Brand selector for generation
  const [generateBrandId, setGenerateBrandId] = useState<string | null>(null);
  const [brandIdUserSet, setBrandIdUserSet] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

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
        setPlanType(data.plan_type ?? 'free');
        if (data.email) setUserEmail(data.email);
        if (data.member_since) setMemberSince(data.member_since);
        if (data.total_emails != null) setTotalEmails(data.total_emails);
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

  const handleDeleteEmail = async (email: EmailGeneration) => {
    setDeletingEmailId(email.id);
    try {
      const res = await fetch(`/api/email-generations/${email.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmailHistory(prev => prev.filter(e => e.id !== email.id));
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    } finally {
      setDeletingEmailId(null);
      setEmailToDelete(null);
    }
  };

  const loadBrandProfile = async () => {
    setBrandLoading(true);
    try {
      const res = await fetch('/api/brand-profiles');
      if (res.ok) {
        const data = await res.json();
        const profiles: BrandProfile[] = data.profiles || [];
        setBrandProfiles(profiles);
        // Auto-select default brand (or first one) only if user hasn't made an explicit choice yet
        if (profiles.length > 0 && !brandIdUserSet) {
          const defaultProfile = profiles.find(p => p.is_default) || profiles[0];
          setGenerateBrandId(defaultProfile.id);
        }
      }
    } catch (error) {
      console.error('Error loading brand profiles:', error);
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
      const url = selectedBrand 
        ? `/api/brand-profiles/${selectedBrand.id}` 
        : '/api/brand-profiles';
      
      const method = selectedBrand ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandForm,
          is_default: brandProfiles.length === 0 || selectedBrand?.is_default || false
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBrandMessage({ type: 'success', text: selectedBrand ? 'Brand updated successfully!' : 'Brand created successfully!' });
        setTimeout(() => setBrandMessage(null), 3000);
        
        // Reload brands and close form
        await loadBrandProfile();
        setShowBrandForm(false);
        setSelectedBrand(null);
        resetBrandForm();
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

  const resetBrandForm = () => {
    setBrandForm({
      brand_name: '',
      industry: '',
      brand_voice: 'professional' as BrandVoice,
      primary_color: '#5c5cf0',
      secondary_color: '',
      brand_description: '',
      website_url: '',
      logo_url: ''
    });
  };

  const editBrand = (brand: BrandProfile) => {
    setSelectedBrand(brand);
    setBrandForm({
      brand_name: brand.brand_name,
      industry: brand.industry || '',
      brand_voice: brand.brand_voice,
      primary_color: brand.primary_color,
      secondary_color: brand.secondary_color || '',
      brand_description: brand.brand_description || '',
      website_url: brand.website_url || '',
      logo_url: brand.logo_url || ''
    });
    setShowBrandForm(true);
  };

  const createNewBrand = () => {
    setSelectedBrand(null);
    resetBrandForm();
    setShowBrandForm(true);
  };

  const deleteBrand = async (brandId: string) => {
    if (!brandToDelete) return;

    try {
      const res = await fetch(`/api/brand-profiles/${brandId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setBrandMessage({ type: 'success', text: 'Brand deleted successfully!' });
        setTimeout(() => setBrandMessage(null), 3000);
        await loadBrandProfile();
      } else {
        const error = await res.json();
        setBrandMessage({ type: 'error', text: error.error || 'Failed to delete brand' });
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      setBrandMessage({ type: 'error', text: 'An error occurred while deleting' });
    } finally {
      setDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  const openDeleteModal = (brand: BrandProfile) => {
    setBrandToDelete({ id: brand.id, name: brand.brand_name });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setBrandToDelete(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setBrandMessage({ type: 'error', text: 'Please upload an image file' });
      setTimeout(() => setBrandMessage(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setBrandMessage({ type: 'error', text: 'Image must be less than 5MB' });
      setTimeout(() => setBrandMessage(null), 3000);
      return;
    }

    setBrandMessage({ type: 'success', text: 'Uploading logo…' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setBrandMessage({ type: 'error', text: data.error || 'Upload failed' });
        setTimeout(() => setBrandMessage(null), 3000);
      } else {
        setBrandForm({ ...brandForm, logo_url: data.url });
        setBrandMessage({ type: 'success', text: 'Logo uploaded!' });
        setTimeout(() => setBrandMessage(null), 2000);
      }
    } catch {
      setBrandMessage({ type: 'error', text: 'Network error during upload' });
      setTimeout(() => setBrandMessage(null), 3000);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailInput.trim()) {
      setGenerationError('Please enter a prompt');
      return;
    }

    if (planType !== 'enterprise' && creditsRemaining !== null && creditsRemaining < 1) {
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
        body: JSON.stringify({ 
          prompt: emailInput.trim(),
          designStyle: designStyle,
          brandProfileId: generateBrandId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setGenerationError(data.error || 'Failed to generate email');
        return;
      }

      // Success
      setGeneratedEmail(data.generation);
      if (data.creditsRemaining !== null && data.creditsRemaining !== undefined) {
        setCreditsRemaining(data.creditsRemaining);
      }
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
    <div className="flex h-screen overflow-hidden overflow-x-hidden">
      {generating && <EmailGeneratingOverlay />}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-black to-gray-900 border-4 border-red-500 rounded-2xl shadow-2xl shadow-red-500/50 max-w-md w-full p-8 transform transition-all">
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-white mb-3 text-center">Delete Brand?</h3>
            
            {/* Message */}
            <p className="text-white/70 text-center mb-2 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">"{brandToDelete?.name}"</span>?
            </p>
            <p className="text-red-400 text-sm text-center mb-8 font-semibold">
              This action cannot be undone!
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-bold hover:bg-white/20 hover:border-white/30 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => brandToDelete && deleteBrand(brandToDelete.id)}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 border-2 border-red-600 text-white font-black hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/50 transition-all transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Delete Confirmation Modal */}
      {emailToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEmailToDelete(null)} />
          <div className="relative bg-gradient-to-br from-black to-gray-900 border-4 border-red-500 rounded-2xl shadow-2xl shadow-red-500/50 max-w-md w-full p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 text-center">Delete Email?</h3>
            <p className="text-white/70 text-center mb-2 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">"{emailToDelete.subject_line || 'this email'}"</span>?
            </p>
            <p className="text-red-400 text-sm text-center mb-8 font-semibold">This action cannot be undone!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setEmailToDelete(null)}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-bold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEmail(emailToDelete)}
                disabled={deletingEmailId === emailToDelete.id}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 border-2 border-red-600 text-white font-black hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/50 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {deletingEmailId === emailToDelete.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              {/* Collapsed: icon only */}
              <img
                src="/logo.png"
                alt="Emlet"
                className="h-8 w-8 flex-shrink-0 rounded object-contain lg:group-hover:hidden"
              />
              {/* Expanded: full logo */}
              <img
                src="/logo.png"
                alt="Emlet"
                className="hidden h-8 object-contain lg:group-hover:block whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out"
              />
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
      <main className="flex-1 overflow-y-auto overflow-x-hidden lg:ml-16 relative">
        {/* Animated gradient blobs background - only for new-email tab */}
        {activeTab === 'new-email' && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 min-h-full z-0 overflow-hidden">
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

        <div className="p-4 sm:p-6 lg:p-8 relative z-10 overflow-x-hidden">
          {/* Tab content */}
          {activeTab === 'new-email' && (
            <div className="space-y-6 pt-12 sm:pt-16 lg:pt-24 relative z-10 overflow-x-hidden">
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!generating && emailInput.trim()) handleGenerateEmail();
                        }
                      }}
                      placeholder="Describe the email you want to create... (e.g., Product launch announcement with 30% discount for existing customers)"
                      className="w-full resize-none rounded-lg sm:rounded-xl border-0 bg-black/60 px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:text-white min-h-[140px] sm:min-h-[160px]"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-white/60 justify-center sm:justify-start flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-[#00ffff]">AI-powered</span>
                        </span>
                        <span className="text-white/30">·</span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
                            className="flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 rounded-lg pl-3 pr-2 py-1.5 text-xs font-medium text-white hover:border-white/40 hover:from-white/15 hover:to-white/10 transition-all min-w-[140px]"
                          >
                            <span className="flex-1 text-left">
                              {designStyle === 'minimalist' && '✦ Minimalist'}
                              {designStyle === 'editorial' && '📰 Editorial'}
                              {designStyle === 'retro' && '🕹️ Retro'}
                              {designStyle === 'brutalist' && '▪️ Brutalist'}
                              {designStyle === 'cyberpunk' && '⚡ Cyberpunk'}
                              {designStyle === 'handwritten' && '✍️ Handwritten'}
                              {designStyle === 'bauhaus' && '▲ Bauhaus'}
                            </span>
                            <svg className={`w-4 h-4 text-white/60 transition-transform ${styleDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {styleDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setStyleDropdownOpen(false)}
                              />
                              <div className="absolute left-0 top-full mt-2 w-48 max-h-[240px] bg-gradient-to-b from-black via-black to-black/95 border-2 border-white/20 rounded-lg shadow-2xl shadow-black/50 overflow-y-auto z-20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40 backdrop-blur-xl">
                                {([
                                  { value: 'minimalist', label: '✦ Minimalist', desc: 'Clean & Simple' },
                                  { value: 'editorial', label: '📰 Editorial', desc: 'Magazine Style' },
                                  { value: 'retro', label: '🕹️ Retro', desc: 'Vintage Vibes' },
                                  { value: 'brutalist', label: '▪️ Brutalist', desc: 'Bold & Raw' },
                                  { value: 'cyberpunk', label: '⚡ Cyberpunk', desc: 'Neon Future' },
                                  { value: 'handwritten', label: '✍️ Handwritten', desc: 'Organic Touch' },
                                  { value: 'bauhaus', label: '▲ Bauhaus', desc: 'Geometric' }
                                ] as const).map((style) => (
                                  <button
                                    key={style.value}
                                    type="button"
                                    onClick={() => {
                                      setDesignStyle(style.value);
                                      setStyleDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 ${
                                      designStyle === style.value ? 'bg-[#00ffff]/10 text-[#00ffff]' : 'text-white'
                                    }`}
                                  >
                                    <div className="font-medium text-sm">{style.label}</div>
                                    <div className="text-xs text-white/50 mt-0.5">{style.desc}</div>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-white/30">·</span>
                        {/* Brand selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                            className="flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 rounded-lg pl-3 pr-2 py-1.5 text-xs font-medium text-white hover:border-white/40 hover:from-white/15 hover:to-white/10 transition-all min-w-[130px]"
                          >
                            {(() => {
                              const brand = brandProfiles.find(b => b.id === generateBrandId);
                              return brand ? (
                                <>
                                  <span
                                    className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                                    style={{ backgroundColor: brand.primary_color }}
                                  />
                                  <span className="flex-1 text-left truncate">{brand.brand_name}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-white/40">🏷️</span>
                                  <span className="flex-1 text-left text-white/50">No brand</span>
                                </>
                              );
                            })()}
                            <svg className={`w-4 h-4 text-white/60 flex-shrink-0 transition-transform ${brandDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {brandDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setBrandDropdownOpen(false)}
                              />
                              <div className="absolute left-0 top-full mt-2 w-52 max-h-[220px] bg-gradient-to-b from-black via-black to-black/95 border-2 border-white/20 rounded-lg shadow-2xl shadow-black/50 overflow-y-auto z-20 backdrop-blur-xl">
                                {brandProfiles.length === 0 ? (
                                  <div className="px-4 py-4 text-center">
                                    <p className="text-xs text-white/40 mb-2">No brand profiles yet</p>
                                    <button
                                      type="button"
                                      onClick={() => { setBrandDropdownOpen(false); handleTabChange('brand'); }}
                                      className="text-xs text-[#00ffff] underline"
                                    >
                                      Create one →
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => { setGenerateBrandId(null); setBrandIdUserSet(true); setBrandDropdownOpen(false); }}
                                      className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 ${
                                        generateBrandId === null ? 'bg-[#00ffff]/10 text-[#00ffff]' : 'text-white/50'
                                      }`}
                                    >
                                      <div className="text-xs font-medium">No brand</div>
                                      <div className="text-xs text-white/30 mt-0.5">Generic email</div>
                                    </button>
                                    {brandProfiles.map((brand) => (
                                      <button
                                        key={brand.id}
                                        type="button"
                                        onClick={() => { setGenerateBrandId(brand.id); setBrandIdUserSet(true); setBrandDropdownOpen(false); }}
                                        className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 ${
                                          generateBrandId === brand.id ? 'bg-[#00ffff]/10 text-[#00ffff]' : 'text-white'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span
                                            className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                                            style={{ backgroundColor: brand.primary_color }}
                                          />
                                          <span className="font-medium text-sm truncate">{brand.brand_name}</span>
                                          {brand.is_default && (
                                            <span className="text-[10px] text-[#00ffff]/70 border border-[#00ffff]/30 rounded px-1 ml-auto flex-shrink-0">default</span>
                                          )}
                                        </div>
                                        {brand.industry && (
                                          <div className="text-xs text-white/40 mt-0.5 pl-5">{brand.industry}</div>
                                        )}
                                      </button>
                                    ))}
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-white/30 hidden xs:inline">·</span>
                        <span className="hidden xs:inline">
                          {planType === 'enterprise' ? 'Unlimited credits' : creditsRemaining !== null ? `${creditsRemaining} credits left` : 'Loading...'}
                        </span>
                      </div>
                      <button 
                        onClick={handleGenerateEmail}
                        disabled={generating || !emailInput.trim() || (planType !== 'enterprise' && creditsRemaining !== null && creditsRemaining < 1)}
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
              {!showBrandForm ? (
                <>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Brand Profiles</h1>
                      <p className="text-sm sm:text-base text-white/60">
                        {brandProfiles.length === 0 
                          ? 'Create your first brand profile to personalize your email campaigns' 
                          : `${brandProfiles.length} brand${brandProfiles.length === 1 ? '' : 's'} configured`}
                      </p>
                    </div>
                    <button
                      onClick={createNewBrand}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-bold hover:shadow-lg hover:shadow-[#00ffff]/50 transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Brand
                    </button>
                  </div>

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

                  {brandLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]"></div>
                    </div>
                  ) : (
                    brandProfiles.length === 0 ? (
                      <div className="p-12 rounded-xl border-2 border-dashed border-white/20 bg-white/5 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#00ff00]/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Create Your First Brand</h3>
                      <p className="text-white/60 mb-8 max-w-md mx-auto">
                        Add your brand profile to generate personalized, on-brand email content with AI. 
                        You can create multiple brands for different products or businesses.
                      </p>
                      <button
                        onClick={createNewBrand}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-bold hover:shadow-xl hover:shadow-[#00ffff]/50 transition-all text-lg"
                      >
                        Get Started
                      </button>
                    </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {brandProfiles.map((brand) => (
                        <div
                          key={brand.id}
                          className="group relative rounded-xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/10 hover:border-[#00ffff]/50 hover:shadow-xl hover:shadow-[#00ffff]/20 transition-all overflow-hidden"
                        >
                          {/* Decorative gradient */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00ffff]/10 to-transparent rounded-full blur-3xl -z-10" />
                          
                          {/* Default Badge */}
                          {brand.is_default && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#00ffff] text-black text-[10px] font-black tracking-wider z-10">
                              DEFAULT
                            </div>
                          )}

                          {/* Logo */}
                          <div className="p-4 pb-3 flex justify-center">
                            <div className="w-20 h-20 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                              {brand.logo_url ? (
                                <img 
                                  src={brand.logo_url} 
                                  alt={brand.brand_name} 
                                  className="w-full h-full object-contain p-2" 
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    if (target.parentElement) {
                                      const span = document.createElement('span');
                                      span.className = 'text-3xl font-black text-white';
                                      span.textContent = brand.brand_name.charAt(0).toUpperCase();
                                      target.parentElement.appendChild(span);
                                    }
                                  }} 
                                />
                              ) : (
                                <span className="text-3xl font-black text-white">{brand.brand_name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="px-4 pb-4 space-y-3">
                            {/* Brand Name */}
                            <div className="text-center">
                              <h3 className="text-sm font-black text-white mb-1 truncate">{brand.brand_name}</h3>
                              {brand.industry && (
                                <p className="text-[11px] text-white/60 truncate">{brand.industry}</p>
                              )}
                            </div>

                            {/* Brand Voice Badge */}
                            <div className="flex justify-center">
                              <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-[11px] text-white font-semibold capitalize">
                                {brand.brand_voice}
                              </span>
                            </div>

                            {/* Brand Colors */}
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <div 
                                  className="flex-1 h-8 rounded-md border-2 border-white/30 shadow-lg" 
                                  style={{ backgroundColor: brand.primary_color }}
                                  title={`Primary: ${brand.primary_color}`}
                                />
                                {brand.secondary_color && (
                                  <div 
                                    className="flex-1 h-8 rounded-md border-2 border-white/30 shadow-lg" 
                                    style={{ backgroundColor: brand.secondary_color }}
                                    title={`Secondary: ${brand.secondary_color}`}
                                  />
                                )}
                              </div>
                              <div className="flex gap-2 text-[10px] text-white/50 font-mono">
                                <span className="flex-1 text-center truncate">{brand.primary_color}</span>
                                {brand.secondary_color && (
                                  <span className="flex-1 text-center truncate">{brand.secondary_color}</span>
                                )}
                              </div>
                            </div>

                            {/* Website URL */}
                            {brand.website_url && (
                              <div className="text-center">
                                <div className="text-[11px] text-white/50 inline-flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                  </svg>
                                  <span className="truncate max-w-[120px]">
                                    {brand.website_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Description */}
                            {brand.brand_description && (
                              <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed text-center">
                                {brand.brand_description}
                              </p>
                            )}
                          </div>

                          {/* Card Footer - Actions */}
                          <div className="px-4 pb-4 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => editBrand(brand)}
                                className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-[#00ffff]/10 to-[#00ff00]/10 border border-[#00ffff]/30 text-white text-[11px] font-bold hover:from-[#00ffff]/20 hover:to-[#00ff00]/20 hover:border-[#00ffff]/50 transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(brand);
                                }}
                                className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                                title="Delete brand"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    )
                  )}
                </>
              ) : (
                /* Brand Form */
                <div className="max-w-2xl space-y-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedBrand ? 'Edit Brand' : 'Create New Brand'}</h2>
                      <p className="text-sm text-white/60 mt-1">
                        {selectedBrand ? 'Update your brand information' : 'Add a new brand profile for your email campaigns'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowBrandForm(false);
                        setSelectedBrand(null);
                        resetBrandForm();
                      }}
                      className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      title="Close"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

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

                  {/* Logo URL Input & Preview */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Brand Logo (Optional)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png or paste image URL"
                        value={brandForm.logo_url}
                        onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                      />
                      <label className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-white/40">Enter a URL, upload an image (max 5MB), or use auto-fill from website analyzer</p>
                    
                    {/* Logo Preview */}
                    {brandForm.logo_url && (
                      <div className="mt-4 flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-20 h-20 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden p-2 flex-shrink-0">
                          <img 
                            src={brandForm.logo_url} 
                            alt="Brand logo preview" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                const div = document.createElement('div');
                                div.className = 'flex flex-col items-center gap-1';
                                div.innerHTML = `
                                  <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span class="text-[10px] text-red-400">Failed</span>
                                `;
                                target.parentElement.appendChild(div);
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium mb-1">Logo Preview</p>
                          <p className="text-xs text-white/50 truncate">
                            {brandForm.logo_url}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBrandForm({ ...brandForm, logo_url: '' })}
                          className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    )}
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
                      <optgroup label="Tech">
                        <option value="Technology">Technology</option>
                        <option value="SaaS">SaaS &amp; Software</option>
                        <option value="AI">AI &amp; Machine Learning</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </optgroup>
                      <optgroup label="Commerce">
                        <option value="E-commerce">E-commerce</option>
                        <option value="Retail">Retail</option>
                        <option value="Fashion">Fashion &amp; Apparel</option>
                        <option value="Food &amp; Beverage">Food &amp; Beverage</option>
                        <option value="Real Estate">Real Estate</option>
                      </optgroup>
                      <optgroup label="Services">
                        <option value="Finance">Finance &amp; Banking</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Legal">Legal</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Marketing">Marketing &amp; Advertising</option>
                      </optgroup>
                      <optgroup label="People">
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Non-profit">Non-profit</option>
                        <option value="Government">Government</option>
                      </optgroup>
                      <optgroup label="Creative">
                        <option value="Media">Media &amp; Publishing</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Travel">Travel &amp; Hospitality</option>
                        <option value="Sports">Sports &amp; Fitness</option>
                        <option value="Beauty">Beauty &amp; Wellness</option>
                      </optgroup>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
                      <div className="flex gap-3 items-center">
                        <div className="relative flex-shrink-0">
                          <input
                            type="color"
                            value={brandForm.primary_color}
                            onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-inner cursor-pointer"
                            style={{ backgroundColor: brandForm.primary_color }}
                          />
                        </div>
                        <input
                          type="text"
                          value={brandForm.primary_color}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setBrandForm({ ...brandForm, primary_color: val });
                          }}
                          maxLength={7}
                          placeholder="#5c5cf0"
                          className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-black border border-white/20 text-white font-mono text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Secondary Color
                        <span className="ml-2 text-xs text-white/40 font-normal">(optional)</span>
                      </label>
                      <div className="flex gap-3 items-center">
                        <div className="relative flex-shrink-0">
                          <input
                            type="color"
                            value={brandForm.secondary_color || '#ffffff'}
                            onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-inner cursor-pointer"
                            style={{ backgroundColor: brandForm.secondary_color || 'transparent',
                              backgroundImage: brandForm.secondary_color ? 'none' : 'repeating-conic-gradient(#ffffff18 0% 25%, transparent 0% 50%) 0 0 / 12px 12px'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex gap-2">
                          <input
                            type="text"
                            value={brandForm.secondary_color || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^#[0-9A-Fa-f]{0,6}$/.test(val)) setBrandForm({ ...brandForm, secondary_color: val });
                            }}
                            maxLength={7}
                            placeholder="#ffffff"
                            className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-black border border-white/20 text-white font-mono text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
                          />
                          {brandForm.secondary_color && (
                            <button
                              type="button"
                              onClick={() => setBrandForm({ ...brandForm, secondary_color: '' })}
                              className="px-3 py-3 rounded-lg border border-white/20 text-white/40 hover:text-white hover:border-white/40 transition-colors text-xs"
                              title="Clear secondary color"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
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
                    {brandSaving ? 'Saving...' : selectedBrand ? 'Update Brand' : 'Create Brand'}
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {emailHistory.map((email) => {
                    const isDeleting = deletingEmailId === email.id;
                    
                    return (
                      <div
                        key={email.id}
                        className="group relative cursor-pointer rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#00ffff]/50 hover:shadow-lg hover:shadow-[#00ffff]/20 transition-all"
                        onClick={() => window.location.href = `/dashboard/email/${email.id}`}
                      >
                        {/* Delete button — top-left, stops propagation */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setEmailToDelete(email); }}
                          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                          title="Delete email"
                        >
                          {isDeleting ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>

                        {/* Status badge */}
                        <div className="absolute top-2 right-2 z-10">
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

                        {/* Scaled HTML preview thumbnail */}
                        <div className="relative w-full overflow-hidden bg-white" style={{ height: 220 }}>
                          {email.html_code ? (
                            <iframe
                              srcDoc={email.html_code}
                              title={email.subject_line || 'Email preview'}
                              sandbox="allow-same-origin"
                              scrolling="no"
                              className="absolute top-0 left-1/2 border-0 pointer-events-none"
                              style={{
                                width: 600,
                                height: 900,
                                transform: 'translateX(-50%) scale(0.38)',
                                transformOrigin: 'top center',
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                              <svg className="w-8 h-8 text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-white/40 text-xs">No preview</span>
                            </div>
                          )}
                          {/* Hover overlay to block iframe interaction */}
                          <div className="absolute inset-0 group-hover:bg-[#00ffff]/5 transition-colors" />
                        </div>

                        {/* Email info */}
                        <div className="p-3">
                          <h3 className="text-white font-semibold mb-0.5 truncate text-sm group-hover:text-[#00ffff] transition-colors">
                            {email.subject_line || 'Untitled Email'}
                          </h3>
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
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-white">Account Settings</h1>
                <p className="text-sm text-white/40">Manage your profile, plan, and billing</p>
              </div>

              {/* ── Profile card ─────────────────────────────────────── */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ffff] to-[#00ff00] flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                  {userEmail ? userEmail[0].toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{userEmail || '—'}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Member since {memberSince ? new Date(memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>

              {/* ── Usage stats row ──────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Emails', value: totalEmails },
                  { label: 'This Month', value: '—' },
                  { label: 'Credits Used', value: creditsRemaining !== null && planType !== 'enterprise' ? (planType === 'pro' ? 50 : 5) - creditsRemaining : '∞' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* ── Plan & billing ───────────────────────────────────── */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">Plan &amp; Billing</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    planType === 'enterprise'
                      ? 'bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30'
                      : planType === 'pro'
                      ? 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30'
                      : 'bg-white/10 text-white/60 border border-white/10'
                  }`}>
                    {planType === 'free' ? 'FREE' : planType === 'pro' ? 'PRO' : 'ENTERPRISE'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Credits remaining</span>
                    <span className="text-white font-medium">
                      {planType === 'enterprise' ? 'Unlimited' : creditsRemaining !== null ? `${creditsRemaining} / ${planType === 'pro' ? 50 : 5}` : '—'}
                    </span>
                  </div>
                  {planType !== 'enterprise' && creditsRemaining !== null && (
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          planType === 'pro'
                            ? 'bg-gradient-to-r from-[#00ffff] to-[#00ff00]'
                            : 'bg-gradient-to-r from-[#00ffff] to-[#00ff00]'
                        }`}
                        style={{ width: `${Math.round((creditsRemaining / (planType === 'pro' ? 50 : 5)) * 100)}%` }}
                      />
                    </div>
                  )}
                  {planType !== 'enterprise' && (
                    <p className="text-xs text-white/30">Resets monthly</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  {planType !== 'enterprise' && (
                    <a
                      href="/pricing"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#00ffff]/30 hover:-translate-y-px transition-all"
                    >
                      {planType === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                    </a>
                  )}
                  {(planType === 'pro' || planType === 'enterprise') && (
                    <ManageBillingButton />
                  )}
                </div>
              </div>

              {/* ── Session ──────────────────────────────────────────── */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Sign out</p>
                  <p className="text-xs text-white/40 mt-0.5">You'll be redirected to the home page</p>
                </div>
                <button
                  onClick={async () => { await signOut(); }}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-all"
                >
                  Sign Out
                </button>
              </div>

              {/* ── Danger zone ──────────────────────────────────────── */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-400">Delete account</p>
                  <p className="text-xs text-white/30 mt-0.5">Permanently remove your account and all data</p>
                </div>
                <button className="px-5 py-2 rounded-xl border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
