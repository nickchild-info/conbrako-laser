import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import productImage1 from 'figma:asset/cad068ef851209ee592ec35da11df2bd06383e55.png';
import productImage2 from 'figma:asset/8d5547a11416c74725619d181966643081aaeabb.png';
import productImage3 from 'figma:asset/747f26119ead4793d0ff90444a1f2a407fafd198.png';

export function BrandGuidelines() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(id);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = {
    primary: [
      { name: 'Ember', hex: '#d84315', usage: 'Primary CTA, accents, heat/fire associations' },
      { name: 'Flame', hex: '#ff5722', usage: 'Hover states, active elements, highlights' },
    ],
    secondary: [
      { name: 'Charcoal', hex: '#0a0a0a', usage: 'Primary backgrounds, text on light' },
      { name: 'Soot', hex: '#1a1a1a', usage: 'Cards, elevated surfaces' },
      { name: 'Steel Grey', hex: '#404040', usage: 'Oxidized steel accent, borders' },
    ],
    neutrals: [
      { name: 'Sand', hex: '#d4c5b0', usage: 'Warm neutral, backgrounds for contrast' },
      { name: 'Stone', hex: '#8a7f72', usage: 'Muted text, secondary information' },
      { name: 'Ash', hex: '#6b6b6b', usage: 'Disabled states, subtle text' },
      { name: 'Smoke', hex: '#2a2a2a', usage: 'Subtle borders, dividers' },
      { name: 'White Hot', hex: '#fafafa', usage: 'Primary text on dark, active states' },
    ],
  };

  const typography = [
    {
      category: 'Headlines',
      font: 'Bebas Neue',
      googleFont: 'Bebas+Neue',
      weight: '400',
      usage: 'Hero headlines, section titles, product names',
      characteristics: 'Condensed, bold, industrial',
      example: 'CUT FROM STEEL',
      size: 'text-5xl',
    },
    {
      category: 'Body',
      font: 'Inter',
      googleFont: 'Inter:400,500,600,700',
      weight: '400-700',
      usage: 'All body copy, descriptions, UI labels',
      characteristics: 'Clean, readable, versatile',
      example: 'Premium steel construction built to last',
      size: 'text-base',
    },
  ];

  const imageryRules = [
    {
      title: 'Product Photography',
      rules: [
        'Harsh sunlight casting strong shadows on steel surfaces',
        'Night shots with fire blazing, capturing ember glow and sparks',
        'Macro details: laser-cut edges, weld points, steel texture',
        'Hands-on assembly shots showing flat-pack engineering',
        'Natural environments: backyard braais, bush camps, rugged outdoor settings',
      ],
    },
    {
      title: 'Lighting & Mood',
      rules: [
        'High contrast—avoid soft, diffused lighting',
        'Golden hour for warmth; blue hour for drama',
        'Fire/ember light as key light source in night shots',
        'Show heat distortion, smoke, active use',
      ],
    },
    {
      title: 'Background Textures',
      rules: [
        'Brushed steel plate (horizontal grain)',
        'Oxidized/rusted metal with patina',
        'Heat discoloration marks and burn patterns',
        'Raw concrete, gravel, or sandy earth',
      ],
    },
  ];

  const brandVoice = {
    taglines: [
      'Cut From Steel. Built To Last.',
      'Rugged As Hell.',
      'Flat-Pack Fire. Full-Time Braai.',
      'Steel Guts. Real Fire.',
      'Engineered To Ember.',
      'Laser-Cut. Hand-Assembled. Fire-Tested.',
      'Rugged By Design. Braai By Nature.',
      'Collapsible Chaos. Controlled Burn.',
      'From Flatpack To Firepit In Minutes.',
      'No Frills. All Fire.',
    ],
    headlineRules: [
      'Keep it punchy—3-7 words max',
      'Active voice, imperative commands work well',
      'Use contrast: technical terms + rough slang',
      'Example: "Laser-Precision Meets Backyard Chaos"',
    ],
    microcopy: [
      {
        context: 'Product card subtitle',
        example: 'Flat-pack steel | Laser-cut precision',
      },
      {
        context: 'Add to cart',
        example: 'Chuck It In The Bakkie →',
      },
      {
        context: 'Bundle badge',
        example: 'FIRE STARTER PACK',
      },
      {
        context: 'Stock indicator',
        example: 'Ready to ship—no waiting around',
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-[#d84315] text-white text-xs mb-4">
              BRAND ATTRIBUTES
            </div>
            <h2 className="text-4xl text-[#fafafa] mb-4" style={{ fontWeight: 900 }}>
              Unapologetically Rugged
            </h2>
            <p className="text-[#a1a1a1] text-lg mb-6 leading-relaxed">
              KoosDoos Fire Pits embody South African braai culture with industrial-grade steel construction. 
              Laser-cut precision meets backyard chaos. Premium engineering with a cheeky, confident attitude—
              designed for those who take their fire seriously, but not themselves.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Rugged', 'Industrial', 'Durable', 'Practical', 'Confident'].map((attr) => (
                <span key={attr} className="px-4 py-2 bg-[#1a1a1a] text-[#d4c5b0] text-sm border border-[#404040]">
                  {attr}
                </span>
              ))}
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src={productImage1}
              alt="KoosDoos fire pit with laser-cut flame pattern, actively burning"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Color System */}
      <section className="mb-20">
        <h2 className="text-3xl text-[#fafafa] mb-8" style={{ fontWeight: 900 }}>
          Color System
        </h2>
        
        {/* Primary Colors */}
        <div className="mb-10">
          <h3 className="text-xl text-[#d4c5b0] mb-4">Primary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colors.primary.map((color) => (
              <div key={color.hex} className="border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div
                  className="h-32 w-full"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[#fafafa]">{color.name}</h4>
                    <button
                      onClick={() => copyToClipboard(color.hex, color.hex)}
                      className="flex items-center gap-2 text-[#a1a1a1] hover:text-[#fafafa] text-sm transition-colors"
                    >
                      {copiedColor === color.hex ? (
                        <>
                          <Check size={16} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>{color.hex}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[#8a7f72] text-sm">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="mb-10">
          <h3 className="text-xl text-[#d4c5b0] mb-4">Secondary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colors.secondary.map((color) => (
              <div key={color.hex} className="border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[#fafafa] text-sm">{color.name}</h4>
                    <button
                      onClick={() => copyToClipboard(color.hex, color.hex)}
                      className="text-[#a1a1a1] hover:text-[#fafafa] transition-colors"
                    >
                      {copiedColor === color.hex ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[#6b6b6b] text-xs mb-2">{color.hex}</p>
                  <p className="text-[#8a7f72] text-xs">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="mb-10">
          <h3 className="text-xl text-[#d4c5b0] mb-4">Neutrals</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {colors.neutrals.map((color) => (
              <div key={color.hex} className="border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div
                  className="h-20 w-full"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="p-3">
                  <h4 className="text-[#fafafa] text-xs mb-1">{color.name}</h4>
                  <button
                    onClick={() => copyToClipboard(color.hex, color.hex)}
                    className="text-[#6b6b6b] hover:text-[#fafafa] text-xs transition-colors"
                  >
                    {copiedColor === color.hex ? '✓ ' : ''}{color.hex}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-20">
        <h2 className="text-3xl text-[#fafafa] mb-8" style={{ fontWeight: 900 }}>
          Typography
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {typography.map((type) => (
            <div key={type.category} className="border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#d4c5b0] mb-1">{type.category}</h3>
                  <p className="text-[#6b6b6b] text-sm">
                    Google Font: <span className="text-[#a1a1a1]">{type.font}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#6b6b6b] text-xs">Weight</p>
                  <p className="text-[#fafafa] text-sm">{type.weight}</p>
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-[#0a0a0a] rounded">
                <link href={`https://fonts.googleapis.com/css2?family=${type.googleFont}&display=swap`} rel="stylesheet" />
                <p
                  className={`${type.size} text-[#fafafa]`}
                  style={{ fontFamily: type.font }}
                >
                  {type.example}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[#8a7f72] text-sm">
                  <span className="text-[#d4c5b0]">Usage:</span> {type.usage}
                </p>
                <p className="text-[#8a7f72] text-sm">
                  <span className="text-[#d4c5b0]">Characteristics:</span> {type.characteristics}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-6 bg-[#1a1a1a] border border-[#404040] rounded-lg">
          <h4 className="text-[#fafafa] mb-3">Usage Rules</h4>
          <ul className="space-y-2 text-[#a1a1a1] text-sm">
            <li>• Headlines (Bebas Neue): All caps for primary headlines, title case for subheads</li>
            <li>• Body (Inter): Regular (400) for body, Medium (500) for emphasis, Semi-bold (600) for labels, Bold (700) for small caps labels</li>
            <li>• Avoid using Bebas Neue for body copy—readability suffers below 18px</li>
            <li>• Maintain high contrast: white text on dark backgrounds, dark text on sand/light backgrounds</li>
          </ul>
        </div>
      </section>

      {/* Imagery Style Guide */}
      <section className="mb-20">
        <h2 className="text-3xl text-[#fafafa] mb-8" style={{ fontWeight: 900 }}>
          Imagery Style Guide
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={productImage1}
              alt="Laser-cut fire pit with flame pattern, active fire"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
              <p className="text-white text-sm">Night Fire | Ember Glow</p>
            </div>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={productImage2}
              alt="Elephant design fire pit with laser-cut details"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
              <p className="text-white text-sm">Laser-Cut Details | Active Use</p>
            </div>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={productImage3}
              alt="Raw steel construction in factory setting"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
              <p className="text-white text-sm">Steel Texture | Industrial</p>
            </div>
          </div>
        </div>

        {imageryRules.map((section) => (
          <div key={section.title} className="mb-6 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
            <h3 className="text-[#d4c5b0] text-lg mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.rules.map((rule, idx) => (
                <li key={idx} className="text-[#a1a1a1] text-sm flex items-start gap-3">
                  <span className="text-[#d84315] mt-1">▸</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Brand Voice */}
      <section className="mb-20">
        <h2 className="text-3xl text-[#fafafa] mb-8" style={{ fontWeight: 900 }}>
          Brand Voice
        </h2>

        <div className="mb-8">
          <h3 className="text-[#d4c5b0] text-lg mb-4">Tagline Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {brandVoice.taglines.map((tagline, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
                <p className="text-[#fafafa] text-lg" style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.02em' }}>
                  {tagline}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 p-6 bg-[#1a1a1a] border border-[#404040] rounded-lg">
          <h3 className="text-[#d4c5b0] text-lg mb-4">Headline Style Rules</h3>
          <ul className="space-y-2">
            {brandVoice.headlineRules.map((rule, idx) => (
              <li key={idx} className="text-[#a1a1a1] text-sm flex items-start gap-3">
                <span className="text-[#d84315]">{idx + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#d4c5b0] text-lg mb-4">Product Microcopy Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandVoice.microcopy.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <p className="text-[#8a7f72] text-xs mb-2 uppercase tracking-wide">{item.context}</p>
                <p className="text-[#fafafa]">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}