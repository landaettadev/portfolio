import React from 'react';

/**
 * Soft nebula clouds for section backgrounds: layered blurred gradients with a
 * fractal-noise texture so they read as gas, not as flat gradient blobs.
 */
type Variant = 'violet' | 'teal' | 'mixed';

const PALETTES: Record<Variant, [string, string, string]> = {
  violet: ['rgba(139,92,246,.30)', 'rgba(196,181,253,.14)', 'rgba(94,234,212,.10)'],
  teal: ['rgba(94,234,212,.20)', 'rgba(52,211,153,.12)', 'rgba(139,92,246,.16)'],
  mixed: ['rgba(139,92,246,.24)', 'rgba(94,234,212,.16)', 'rgba(244,114,182,.08)'],
};

const Nebula: React.FC<{ variant?: Variant; className?: string; flip?: boolean }> = ({ variant = 'violet', className = '', flip }) => {
  const [a, b, c] = PALETTES[variant];
  const id = `neb-${variant}-${flip ? 'f' : 'n'}`;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute -z-10 ${className}`} style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <div className="absolute inset-0 animate-nebula-drift will-change-transform" style={{ background: `radial-gradient(40% 45% at 35% 45%, ${a}, transparent 70%), radial-gradient(30% 35% at 62% 38%, ${b}, transparent 70%), radial-gradient(35% 30% at 55% 70%, ${c}, transparent 70%)`, filter: 'blur(30px)' }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" preserveAspectRatio="none">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="4" seed={variant.length * 7} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.4  0 0 0 0 0.95  0 0 0 1.1 -0.35" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} style={{ maskImage: 'radial-gradient(closest-side, #000, transparent)', WebkitMaskImage: 'radial-gradient(closest-side, #000, transparent)' }} />
      </svg>
    </div>
  );
};

export default Nebula;
