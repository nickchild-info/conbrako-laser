import { useState } from 'react';
import { Star, ShoppingCart, Flame } from 'lucide-react';
import productImage1 from 'figma:asset/cad068ef851209ee592ec35da11df2bd06383e55.png';
import productImage2 from 'figma:asset/8d5547a11416c74725619d181966643081aaeabb.png';
import productImage3 from 'figma:asset/747f26119ead4793d0ff90444a1f2a407fafd198.png';

export function ComponentsPage() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl text-[#fafafa] mb-4" style={{ fontWeight: 900 }}>
          UI Components
        </h2>
        <p className="text-[#a1a1a1] max-w-3xl">
          Ecommerce UI style tokens designed for the KoosDoos brand. Rugged, industrial aesthetics with 
          high-contrast elements and bold interactions.
        </p>
      </div>

      {/* Buttons */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Buttons</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Primary Buttons */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <h4 className="text-[#fafafa] mb-6">Primary Actions</h4>
            <div className="space-y-4">
              <button 
                className="w-full bg-[#d84315] hover:bg-[#ff5722] text-white py-4 px-6 transition-colors font-medium tracking-wide"
                onClick={() => setActiveButton('primary-1')}
              >
                ADD TO CART
              </button>
              <button 
                className="w-full bg-[#d84315] hover:bg-[#ff5722] text-white py-4 px-6 transition-colors font-medium tracking-wide flex items-center justify-center gap-3"
                onClick={() => setActiveButton('primary-2')}
              >
                <ShoppingCart size={20} />
                CHUCK IT IN THE BAKKIE
              </button>
              <button 
                className="w-full bg-gradient-to-r from-[#d84315] to-[#ff5722] hover:from-[#ff5722] hover:to-[#d84315] text-white py-4 px-6 transition-all font-medium tracking-wide"
                onClick={() => setActiveButton('primary-3')}
              >
                BUY NOW
              </button>
            </div>
            <div className="mt-6 p-4 bg-[#0a0a0a] rounded border border-[#404040]">
              <p className="text-[#8a7f72] text-xs">
                <span className="text-[#d4c5b0]">Usage:</span> High-contrast ember orange. Bold tracking. 
                All-caps for primary CTAs.
              </p>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <h4 className="text-[#fafafa] mb-6">Secondary Actions</h4>
            <div className="space-y-4">
              <button 
                className="w-full border-2 border-[#404040] hover:border-[#d84315] text-[#fafafa] hover:text-[#d84315] py-4 px-6 transition-colors font-medium tracking-wide"
                onClick={() => setActiveButton('secondary-1')}
              >
                VIEW DETAILS
              </button>
              <button 
                className="w-full border-2 border-[#404040] hover:border-[#d84315] text-[#fafafa] hover:text-[#d84315] py-4 px-6 transition-colors font-medium tracking-wide bg-[#0a0a0a]"
                onClick={() => setActiveButton('secondary-2')}
              >
                ADD TO WISHLIST
              </button>
              <button 
                className="w-full bg-[#2a2a2a] hover:bg-[#404040] text-[#fafafa] py-4 px-6 transition-colors font-medium tracking-wide"
                onClick={() => setActiveButton('secondary-3')}
              >
                LEARN MORE
              </button>
            </div>
            <div className="mt-6 p-4 bg-[#0a0a0a] rounded border border-[#404040]">
              <p className="text-[#8a7f72] text-xs">
                <span className="text-[#d4c5b0]">Usage:</span> Steel grey borders. Subtle hover effects. 
                For supporting actions.
              </p>
            </div>
          </div>

          {/* Small/Compact Buttons */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <h4 className="text-[#fafafa] mb-6">Compact Variants</h4>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#d84315] hover:bg-[#ff5722] text-white py-2 px-5 text-sm font-medium tracking-wide transition-colors">
                SHOP NOW
              </button>
              <button className="border border-[#404040] hover:border-[#d84315] text-[#fafafa] hover:text-[#d84315] py-2 px-5 text-sm font-medium tracking-wide transition-colors">
                COMPARE
              </button>
              <button className="bg-[#2a2a2a] hover:bg-[#404040] text-[#a1a1a1] hover:text-[#fafafa] py-2 px-5 text-sm font-medium tracking-wide transition-colors">
                SPECS
              </button>
              <button className="border border-[#d84315] text-[#d84315] hover:bg-[#d84315] hover:text-white py-2 px-5 text-sm font-medium tracking-wide transition-colors">
                FEATURED
              </button>
            </div>
            <div className="mt-6 p-4 bg-[#0a0a0a] rounded border border-[#404040]">
              <p className="text-[#8a7f72] text-xs">
                <span className="text-[#d4c5b0]">Usage:</span> Reduced padding. Same color system. 
                For tags and inline actions.
              </p>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <h4 className="text-[#fafafa] mb-6">Icon Actions</h4>
            <div className="flex flex-wrap gap-4">
              <button className="w-12 h-12 bg-[#d84315] hover:bg-[#ff5722] text-white flex items-center justify-center transition-colors">
                <ShoppingCart size={20} />
              </button>
              <button className="w-12 h-12 border-2 border-[#404040] hover:border-[#d84315] text-[#fafafa] hover:text-[#d84315] flex items-center justify-center transition-colors">
                <Star size={20} />
              </button>
              <button className="w-12 h-12 bg-[#2a2a2a] hover:bg-[#404040] text-[#a1a1a1] hover:text-[#fafafa] flex items-center justify-center transition-colors">
                <Flame size={20} />
              </button>
              <button className="w-14 h-14 bg-gradient-to-br from-[#d84315] to-[#ff5722] hover:from-[#ff5722] hover:to-[#d84315] text-white rounded-full flex items-center justify-center transition-all shadow-lg">
                <ShoppingCart size={22} />
              </button>
            </div>
            <div className="mt-6 p-4 bg-[#0a0a0a] rounded border border-[#404040]">
              <p className="text-[#8a7f72] text-xs">
                <span className="text-[#d4c5b0]">Usage:</span> Square or circle. Fixed dimensions. 
                Centered icons from lucide-react.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Cards */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Product Cards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Standard */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden group hover:border-[#404040] transition-colors">
            <div className="relative h-64 bg-[#0a0a0a] overflow-hidden">
              <img
                src={productImage1}
                alt="Fire pit with laser-cut flame pattern"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#d84315] text-white text-xs font-medium tracking-wider">
                  BEST SELLER
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[#fafafa] text-lg mb-1">FIRE BOX PRO</h4>
                  <p className="text-[#8a7f72] text-sm">Flat-pack steel | Laser-cut precision</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="#d84315" stroke="#d84315" />
                  <span className="text-[#fafafa] text-sm">4.9</span>
                </div>
              </div>
              <p className="text-[#a1a1a1] text-sm mb-4 line-clamp-2">
                Premium flat-pack fire pit with laser-cut steel construction. Built tough for serious braai sessions.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#fafafa] text-2xl">R 2,499</span>
                <button className="bg-[#d84315] hover:bg-[#ff5722] text-white px-4 py-2 text-sm font-medium tracking-wide transition-colors">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Featured */}
          <div className="bg-[#1a1a1a] border-2 border-[#d84315] rounded-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-[#d84315] text-white px-4 py-1 text-xs font-medium tracking-wider z-10">
              NEW
            </div>
            <div className="relative h-64 bg-[#0a0a0a] overflow-hidden">
              <img
                src={productImage2}
                alt="Elephant design fire pit with flames"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[#fafafa] text-lg mb-1">BOMA RING XL</h4>
                  <p className="text-[#8a7f72] text-sm">Industrial grade | Collapsible</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="#d84315" stroke="#d84315" />
                  <span className="text-[#fafafa] text-sm">5.0</span>
                </div>
              </div>
              <p className="text-[#a1a1a1] text-sm mb-4 line-clamp-2">
                Our largest fire pit. Engineered to ember. Not for sissies.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#fafafa] text-2xl">R 3,799</span>
                <button className="bg-gradient-to-r from-[#d84315] to-[#ff5722] hover:from-[#ff5722] hover:to-[#d84315] text-white px-4 py-2 text-sm font-medium tracking-wide transition-all">
                  BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Bundle */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden group hover:border-[#404040] transition-colors">
            <div className="relative h-64 bg-[#0a0a0a] overflow-hidden">
              <img
                src={productImage3}
                alt="Raw steel fire pit in factory"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#2a2a2a] border border-[#d84315] text-[#d84315] text-xs font-medium tracking-wider">
                  BUNDLE DEAL
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[#fafafa] text-lg mb-1">FIRE STARTER PACK</h4>
                  <p className="text-[#8a7f72] text-sm">Fire box + accessories</p>
                </div>
                <div className="px-2 py-1 bg-[#2a2a2a] text-[#d84315] text-xs font-medium border border-[#404040]">
                  SAVE 15%
                </div>
              </div>
              <p className="text-[#a1a1a1] text-sm mb-4 line-clamp-2">
                Complete kit with fire pit, grill grate, and carry bag. Ready to roll.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#6b6b6b] text-sm line-through mr-2">R 2,999</span>
                  <span className="text-[#fafafa] text-2xl">R 2,549</span>
                </div>
              </div>
              <button className="w-full mt-4 border-2 border-[#404040] hover:border-[#d84315] text-[#fafafa] hover:text-[#d84315] py-2 px-4 text-sm font-medium tracking-wide transition-colors">
                VIEW BUNDLE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Badges & Labels</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Badges */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <h4 className="text-[#fafafa] mb-6">Status Indicators</h4>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 bg-[#d84315] text-white text-sm font-medium tracking-wider">
                NEW
              </span>
              <span className="px-4 py-2 bg-[#d84315] text-white text-sm font-medium tracking-wider">
                BEST SELLER
              </span>
              <span className="px-4 py-2 bg-[#ff5722] text-white text-sm font-medium tracking-wider">
                HOT DEAL
              </span>
              <span className="px-4 py-2 bg-[#2a2a2a] border border-[#d84315] text-[#d84315] text-sm font-medium tracking-wider">
                BUNDLE
              </span>
              <span className="px-4 py-2 bg-[#2a2a2a] text-[#d4c5b0] text-sm font-medium tracking-wider">
                LIMITED STOCK
              </span>
            </div>
            <h4 className="text-[#fafafa] mb-6">Rounded Variants</h4>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-[#d84315] text-white text-xs font-medium tracking-wider rounded-full">
                NEW
              </span>
              <span className="px-4 py-1.5 bg-[#2a2a2a] border border-[#404040] text-[#fafafa] text-xs font-medium tracking-wider rounded-full">
                FEATURED
              </span>
              <span className="px-4 py-1.5 bg-[#1a1a1a] border border-[#d84315] text-[#d84315] text-xs font-medium tracking-wider rounded-full">
                -15%
              </span>
            </div>
          </div>

          {/* Rating Display */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <h4 className="text-[#fafafa] mb-6">Rating Display</h4>
            <div className="space-y-6">
              {/* Standard */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < 4 ? "#d84315" : "none"} stroke="#d84315" />
                  ))}
                </div>
                <span className="text-[#fafafa]">4.8</span>
                <span className="text-[#6b6b6b] text-sm">(127 reviews)</span>
              </div>
              
              {/* Compact */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < 5 ? "#d84315" : "none"} stroke="#d84315" />
                  ))}
                </div>
                <span className="text-[#fafafa] text-sm">5.0</span>
              </div>
              
              {/* With bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#a1a1a1] text-sm w-8">5★</span>
                  <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#d84315] rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[#6b6b6b] text-sm w-10 text-right">85%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#a1a1a1] text-sm w-8">4★</span>
                  <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#d84315] rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-[#6b6b6b] text-sm w-10 text-right">12%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#a1a1a1] text-sm w-8">3★</span>
                  <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#d84315] rounded-full" style={{ width: '3%' }}></div>
                  </div>
                  <span className="text-[#6b6b6b] text-sm w-10 text-right">3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Style Tokens */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Style Tokens</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spacing */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
            <h4 className="text-[#fafafa] mb-4">Spacing</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8a7f72]">xs</span>
                <span className="text-[#fafafa]">8px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a7f72]">sm</span>
                <span className="text-[#fafafa]">12px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a7f72]">md</span>
                <span className="text-[#fafafa]">16px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a7f72]">lg</span>
                <span className="text-[#fafafa]">24px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a7f72]">xl</span>
                <span className="text-[#fafafa]">32px</span>
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
            <h4 className="text-[#fafafa] mb-4">Border Radius</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#8a7f72]">none</span>
                <div className="w-8 h-8 bg-[#404040]"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a7f72]">sm</span>
                <div className="w-8 h-8 bg-[#404040] rounded"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a7f72]">md</span>
                <div className="w-8 h-8 bg-[#404040] rounded-lg"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a7f72]">full</span>
                <div className="w-8 h-8 bg-[#404040] rounded-full"></div>
              </div>
            </div>
            <p className="text-[#6b6b6b] text-xs mt-4">
              Primary: Sharp edges (none/sm) for industrial feel
            </p>
          </div>

          {/* Shadows */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
            <h4 className="text-[#fafafa] mb-4">Shadows</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[#8a7f72] text-sm mb-2">Subtle</p>
                <div className="h-12 bg-[#2a2a2a]" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}></div>
              </div>
              <div>
                <p className="text-[#8a7f72] text-sm mb-2">Ember Glow</p>
                <div className="h-12 bg-[#d84315]" style={{ boxShadow: '0 4px 20px rgba(216,67,21,0.4)' }}></div>
              </div>
            </div>
            <p className="text-[#6b6b6b] text-xs mt-4">
              Use sparingly—reserved for CTAs and overlays
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}