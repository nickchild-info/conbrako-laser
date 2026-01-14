export function LogoExploration() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl text-[#fafafa] mb-4" style={{ fontWeight: 900 }}>
          Logo Exploration
        </h2>
        <p className="text-[#a1a1a1] max-w-3xl">
          Six distinctive logo concepts capturing the rugged, industrial spirit of KoosDoos Fire Pits. 
          Each design balances premium craftsmanship with bold, confident attitude.
        </p>
      </div>

      {/* Wordmarks */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Wordmarks</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wordmark 1: Cut Steel Edge */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <div className="bg-[#0a0a0a] rounded p-12 mb-6 flex items-center justify-center min-h-[280px]">
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
              <div className="text-center">
                <h3 className="text-[#fafafa] mb-2" style={{ 
                  fontFamily: 'Bebas Neue', 
                  fontSize: '82px', 
                  letterSpacing: '-0.02em', 
                  lineHeight: 0.85,
                  fontWeight: 900
                }}>
                  KOOSDOOS
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[2px] w-16 bg-[#d84315]"></div>
                  <p className="text-[#a1a1a1] tracking-[0.3em] text-xs">FIRE PITS</p>
                  <div className="h-[2px] w-16 bg-[#d84315]"></div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#fafafa] mb-2">01. Industrial Condensed</h4>
              <p className="text-[#8a7f72] text-sm mb-4">
                Ultra-condensed heavy weight. Sharp, angular letterforms. Clean and powerful.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Primary</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Web</span>
              </div>
            </div>
          </div>

          {/* Wordmark 2: Geometric Slash */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <div className="bg-[#0a0a0a] rounded p-12 mb-6 flex items-center justify-center min-h-[280px]">
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
              <div className="relative">
                {/* Angled slash accent */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-[#d84315] to-transparent opacity-60 rotate-12"></div>
                
                <div>
                  <h3 className="text-[#fafafa]" style={{ 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '72px', 
                    letterSpacing: '0.05em', 
                    lineHeight: 0.9,
                    fontWeight: 900
                  }}>
                    KOOSDOOS
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-[#d84315]"></div>
                    <p className="text-[#6b6b6b] tracking-[0.25em] text-[11px]">FIRE PITS</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#fafafa] mb-2">02. Slash Accent</h4>
              <p className="text-[#8a7f72] text-sm mb-4">
                Angular accent line suggests cutting/welding. Minimalist and modern with sharp edge.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Featured</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Digital</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon + Wordmark Combos */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Icon + Wordmark</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Icon Combo 1: Geometric K Box */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <div className="bg-[#0a0a0a] rounded p-12 mb-6 flex items-center justify-center min-h-[280px]">
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
              <div className="flex items-center gap-6">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  {/* Outer square representing fire pit */}
                  <rect x="15" y="15" width="70" height="70" stroke="#404040" strokeWidth="3" fill="none"/>
                  
                  {/* Geometric K made of angular cuts */}
                  <path d="M 35 30 L 35 70" stroke="#fafafa" strokeWidth="4" strokeLinecap="square"/>
                  <path d="M 35 50 L 65 30" stroke="#d84315" strokeWidth="4" strokeLinecap="square"/>
                  <path d="M 35 50 L 65 70" stroke="#d84315" strokeWidth="4" strokeLinecap="square"/>
                  
                  {/* Corner accent marks */}
                  <path d="M 15 15 L 25 15 M 15 15 L 15 25" stroke="#d84315" strokeWidth="2"/>
                  <path d="M 85 15 L 75 15 M 85 15 L 85 25" stroke="#d84315" strokeWidth="2"/>
                </svg>
                <div>
                  <h3 className="text-[#fafafa]" style={{ fontFamily: 'Bebas Neue', fontSize: '46px', letterSpacing: '0.02em', lineHeight: 0.85 }}>
                    KOOSDOOS
                  </h3>
                  <p className="text-[#6b6b6b] text-[10px] tracking-[0.3em] mt-1">FIRE PITS</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#fafafa] mb-2">03. Geometric K Mark</h4>
              <p className="text-[#8a7f72] text-sm mb-4">
                Abstract "K" from angular steel cuts. Square frame represents the fire pit box. Clean geometry.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Logo Lock-up</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Packaging</span>
              </div>
            </div>
          </div>

          {/* Icon Combo 2: Hexagon Heat Mark */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <div className="bg-[#0a0a0a] rounded p-12 mb-6 flex items-center justify-center min-h-[280px]">
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
              <div className="text-center">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="mx-auto mb-3">
                  {/* Hexagon */}
                  <path d="M 55 10 L 90 30 L 90 70 L 55 90 L 20 70 L 20 30 Z" 
                        stroke="#404040" strokeWidth="3" fill="none"/>
                  
                  {/* Inner concentric hexagons showing heat/intensity */}
                  <path d="M 55 25 L 75 36 L 75 64 L 55 75 L 35 64 L 35 36 Z" 
                        stroke="#d84315" strokeWidth="2" fill="none" opacity="0.6"/>
                  <path d="M 55 35 L 65 41 L 65 59 L 55 65 L 45 59 L 45 41 Z" 
                        stroke="#ff5722" strokeWidth="2" fill="none" opacity="0.8"/>
                  
                  {/* Center point */}
                  <circle cx="55" cy="55" r="4" fill="#d84315"/>
                </svg>
                <h3 className="text-[#fafafa]" style={{ fontFamily: 'Bebas Neue', fontSize: '40px', letterSpacing: '0.05em', lineHeight: 1 }}>
                  KOOSDOOS
                </h3>
                <p className="text-[#6b6b6b] text-[10px] tracking-[0.3em]">FIRE PITS</p>
              </div>
            </div>
            <div>
              <h4 className="text-[#fafafa] mb-2">04. Heat Mark Hex</h4>
              <p className="text-[#8a7f72] text-sm mb-4">
                Concentric hexagons represent heat radiating outward. Bold geometric form. App icon ready.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">App Icon</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Social</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maker Stamp Badges */}
      <section className="mb-16">
        <h3 className="text-2xl text-[#d4c5b0] mb-8">Maker Stamp Badges</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Badge 1: Round Weld Stamp */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <div className="bg-[#0a0a0a] rounded p-12 mb-6 flex items-center justify-center min-h-[280px]">
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
              <div className="relative w-[180px] h-[180px] rounded-full border-4 border-[#404040] flex items-center justify-center">
                {/* Cardinal point rivets */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                
                <div className="text-center px-8">
                  <p className="text-[#8a7f72] text-[9px] tracking-[0.2em] mb-3">ENGINEERED TO</p>
                  <h3 className="text-[#fafafa]" style={{ fontFamily: 'Bebas Neue', fontSize: '44px', letterSpacing: '0.05em', lineHeight: 0.85 }}>
                    KOOSDOOS
                  </h3>
                  <p className="text-[#8a7f72] text-xs tracking-[0.15em] mt-1 mb-3">FIRE PITS</p>
                  <p className="text-[#6b6b6b] text-[9px] tracking-[0.15em]">LASER-CUT STEEL</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#fafafa] mb-2">05. Round Weld Stamp</h4>
              <p className="text-[#8a7f72] text-sm mb-4">
                Circular badge with vintage industrial feel. Ideal for laser etching on products.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Product Etch</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Seal</span>
              </div>
            </div>
          </div>

          {/* Badge 2: Rectangular Steel Plate */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
            <div className="bg-[#0a0a0a] rounded p-12 mb-6 flex items-center justify-center min-h-[280px]">
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
              <div className="relative w-[180px] h-[180px] rounded-full border-4 border-[#404040] flex items-center justify-center">
                {/* Corner rivets */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d84315]"></div>
                
                <div className="text-center px-10">
                  <h3 className="text-[#fafafa] mb-1" style={{ fontFamily: 'Bebas Neue', fontSize: '52px', letterSpacing: '0.02em', lineHeight: 0.9 }}>
                    KOOSDOOS
                  </h3>
                  <div className="w-20 h-px bg-[#d84315] mx-auto my-2"></div>
                  <p className="text-[#8a7f72] text-xs tracking-[0.2em]">FIRE PITS</p>
                  <p className="text-[#6b6b6b] text-[9px] tracking-[0.15em] mt-2">SOUTH AFRICA</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#fafafa] mb-2">06. Rectangular Steel Plate</h4>
              <p className="text-[#8a7f72] text-sm mb-4">
                Industrial plate design with rivet details. Perfect for product packaging and labels.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Label</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Tag</span>
                <span className="px-3 py-1 bg-[#0a0a0a] text-[#a1a1a1] text-xs border border-[#404040]">Sticker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="p-8 bg-[#1a1a1a] border border-[#404040] rounded-lg">
        <h3 className="text-[#fafafa] text-xl mb-6">Logo Usage Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-[#d4c5b0] mb-3">Clear Space</h4>
            <p className="text-[#8a7f72] text-sm">
              Maintain minimum clear space equal to the height of the "K" in KOOSDOOS around all logos.
            </p>
          </div>
          <div>
            <h4 className="text-[#d4c5b0] mb-3">Minimum Sizes</h4>
            <p className="text-[#8a7f72] text-sm">
              Digital: 120px width minimum • Print: 25mm width minimum for wordmarks, 30mm for badges.
            </p>
          </div>
          <div>
            <h4 className="text-[#d4c5b0] mb-3">Color Variations</h4>
            <p className="text-[#8a7f72] text-sm">
              Primary: Full color on dark • Secondary: Monochrome white on dark • Tertiary: Monochrome dark on light.
            </p>
          </div>
          <div>
            <h4 className="text-[#d4c5b0] mb-3">Prohibited Uses</h4>
            <p className="text-[#8a7f72] text-sm">
              Do not stretch, rotate, add effects, or alter colors. Do not place on busy backgrounds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}