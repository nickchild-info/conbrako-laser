import { useState } from 'react';
import { BrandGuidelines } from '@/app/components/BrandGuidelines';
import { LogoExploration } from '@/app/components/LogoExploration';
import { ComponentsPage } from '@/app/components/ComponentsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'logos' | 'components'>('guidelines');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[#fafafa] text-3xl mb-1" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                KoosDoos Fire Pits
              </h1>
              <p className="text-[#a1a1a1] text-sm">Brand Starter Kit</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#d84315] to-[#ff5722] rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8L21 9L16 14L18 20L12 17L6 20L8 14L3 9L9 8L12 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-5 py-2.5 text-sm transition-colors ${
                activeTab === 'guidelines'
                  ? 'bg-[#1a1a1a] text-[#fafafa]'
                  : 'text-[#a1a1a1] hover:text-[#fafafa]'
              }`}
            >
              Brand Guidelines
            </button>
            <button
              onClick={() => setActiveTab('logos')}
              className={`px-5 py-2.5 text-sm transition-colors ${
                activeTab === 'logos'
                  ? 'bg-[#1a1a1a] text-[#fafafa]'
                  : 'text-[#a1a1a1] hover:text-[#fafafa]'
              }`}
            >
              Logo Exploration
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`px-5 py-2.5 text-sm transition-colors ${
                activeTab === 'components'
                  ? 'bg-[#1a1a1a] text-[#fafafa]'
                  : 'text-[#a1a1a1] hover:text-[#fafafa]'
              }`}
            >
              Components
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>
        {activeTab === 'guidelines' && <BrandGuidelines />}
        {activeTab === 'logos' && <LogoExploration />}
        {activeTab === 'components' && <ComponentsPage />}
      </main>
    </div>
  );
}
