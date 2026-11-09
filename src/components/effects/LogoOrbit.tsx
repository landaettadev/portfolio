import React from 'react';
import TechIcon from '../TechIcon';
import { TECH } from '../../data/tech';

/** Tech logos orbiting the brand mark on three rings: AI inside, cloud in the middle, the build stack outside. */

const pick = (names: string[]) => names.map((n) => TECH.find((t) => t.name === n)).filter(Boolean) as typeof TECH;

const RINGS = [
  { r: 22, dur: 32, dir: 1, items: pick(['Azure AI Foundry', 'OpenAI', 'Copilot Studio', 'Python ML']) },
  { r: 34, dur: 48, dir: -1, items: pick(['Azure', 'Google Cloud', 'Docker', 'GitHub Actions', 'BigQuery']) },
  { r: 46, dur: 70, dir: 1, items: pick(['.NET / ASP.NET Core', 'C#', 'Angular', 'React', 'TypeScript', 'SQL Server', 'PostgreSQL']) },
];

const LogoOrbit: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`group relative aspect-square w-full ${className}`} aria-hidden="true">
    {/* core */}
    <div className="absolute left-1/2 top-1/2 flex h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-night-800 shadow-[0_0_60px_rgba(94,234,212,.35),inset_0_0_30px_rgba(139,92,246,.35)]">
      <img src="/logo.svg" alt="" className="h-1/2 w-1/2" />
    </div>
    {RINGS.map((ring, ri) => (
      <div
        key={ri}
        className={`absolute rounded-full border border-dashed border-white/[0.09] ${ring.dir > 0 ? 'animate-orbit' : 'animate-orbit-rev'} group-hover:[animation-play-state:paused] motion-reduce:animate-none`}
        style={{ inset: `${50 - ring.r}%`, ['--orbit-dur' as string]: `${ring.dur}s` }}
      >
        {ring.items.map((tech, i) => {
          const a = (i / ring.items.length) * Math.PI * 2 + ri;
          return (
            <span
              key={tech.name}
              className="absolute"
              style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%`, transform: 'translate(-50%,-50%)' }}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-night-800/90 shadow-[0_6px_24px_-6px_rgba(0,0,0,.8)] ${ring.dir > 0 ? 'animate-orbit-rev' : 'animate-orbit'} group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:h-11 sm:w-11`}
                style={{ ['--orbit-dur' as string]: `${ring.dur}s` }}
                title={tech.name}
              >
                <TechIcon name={tech.name} icon={tech.icon} size={20} />
              </span>
            </span>
          );
        })}
      </div>
    ))}
  </div>
);

export default LogoOrbit;
