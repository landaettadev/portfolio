import React from 'react';
import { useTranslation } from 'react-i18next';
import { TECH, type Layer } from '../data/tech';
import TechIcon from './TechIcon';
import { spotlightMove } from '../hooks/useSpotlight';
import LogoOrbit from './effects/LogoOrbit';

const LAYERS: { id: Layer; accent: string }[] = [
  { id: 'ai', accent: '#5EEAD4' },
  { id: 'cloud', accent: '#8B5CF6' },
  { id: 'backend', accent: '#A78BFA' },
  { id: 'frontend', accent: '#C4B5FD' },
  { id: 'data', accent: '#34D399' },
  { id: 'devops', accent: '#A49CC2' },
];

/** The stack drawn as the layers of a system, top (AI) to bottom (delivery). */
const Stack: React.FC = () => {
  const { t } = useTranslation();

  const label = (id: Layer) => {
    if (id === 'ai') return t('stackExtra.ai');
    if (id === 'cloud') return t('stackExtra.cloud');
    if (id === 'data') return t('stack.categories.database');
    return t(`stack.categories.${id}`);
  };

  return (
    <section id="stack" className="section">
      <div className="container mx-auto px-5 sm:px-6 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <div className="max-w-3xl">
            <h2 className="section-title">{t('stack.title')}</h2>
            <p className="section-lede">{t('stackExtra.lede')}</p>
          </div>
          <LogoOrbit className="mx-auto max-w-[340px] sm:max-w-[440px]" />
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/[0.08] bg-night-900/50">
          {LAYERS.map((layer, i) => {
            const items = TECH.filter((tech) => tech.layer === layer.id);
            return (
              <div
                key={layer.id}
                onPointerMove={spotlightMove}
                className={`spotlight grid gap-4 px-5 py-6 sm:px-7 md:grid-cols-[200px_1fr] md:items-center ${i > 0 ? 'border-t border-white/[0.07]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full" style={{ background: layer.accent, boxShadow: `0 0 16px ${layer.accent}` }} aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold leading-tight text-white">{label(layer.id)}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map((tech) => (
                    <li
                      key={tech.name}
                      className="flex min-h-[40px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[14.5px] text-white/90 transition-colors duration-200 hover:border-glow/40 hover:bg-white/[0.07] hover:text-white"
                    >
                      <TechIcon name={tech.name} icon={tech.icon} size={20} />
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stack;
