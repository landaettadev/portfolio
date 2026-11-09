import React from 'react';
import { Sparkles } from 'lucide-react';
import TechIcon from '../TechIcon';
import { TECH } from '../../data/tech';

/**
 * Two agents orchestrating cloud and AI services: nodes float at the edges of the
 * CTA, links curve between them and small pulses travel along each link.
 * Coordinates are percentages of the CTA box so the layout stretches with it.
 */

type Node = { id: string; x: number; y: number; label: string; icon?: string; ai?: boolean };

const icon = (name: string) => TECH.find((t) => t.name === name)?.icon;

const HUBS = [
  { id: 'hubL', x: 21, y: 34 },
  { id: 'hubR', x: 79, y: 36 },
];

const NODES: (Node & { hub: string })[] = [
  { id: 'azure', hub: 'hubL', x: 7, y: 16, label: 'Azure', icon: icon('Azure') },
  { id: 'copilot', hub: 'hubL', x: 9, y: 56, label: 'Copilot Studio', ai: true },
  { id: 'aoai', hub: 'hubL', x: 17, y: 82, label: 'Azure OpenAI', ai: true },
  { id: 'dotnet', hub: 'hubL', x: 32, y: 12, label: '.NET', icon: icon('.NET / ASP.NET Core') },
  { id: 'gcp', hub: 'hubR', x: 93, y: 18, label: 'Google Cloud', icon: icon('Google Cloud') },
  { id: 'gemini', hub: 'hubR', x: 90, y: 60, label: 'Gemini', ai: true },
  { id: 'bq', hub: 'hubR', x: 81, y: 84, label: 'BigQuery', ai: false },
  { id: 'python', hub: 'hubR', x: 68, y: 12, label: 'Python', icon: icon('Python ML') },
];

const hubOf = (id: string) => HUBS.find((h) => h.id === id)!;
const curve = (x1: number, y1: number, x2: number, y2: number, bend = 8) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bend;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
};

const LINKS = [
  ...NODES.map((n, i) => ({ id: `l-${n.id}`, d: curve(hubOf(n.hub).x, hubOf(n.hub).y, n.x, n.y, i % 2 ? 6 : -6), dur: 3.2 + (i % 4) * 0.7 })),
  // the two agents talk to each other over the headline
  { id: 'l-hubs', d: 'M 21 34 C 35 -6 65 -6 79 36', dur: 4.6 },
];

const AgentNetwork: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="link-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#5EEAD4" stopOpacity=".55" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity=".55" />
        </linearGradient>
      </defs>
      {LINKS.map((l) => (
        <g key={l.id}>
          <path id={l.id} d={l.d} fill="none" stroke="url(#link-grad)" strokeWidth="1" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" opacity=".7" />
          <ellipse rx=".26" ry=".68" fill="#E0FFFB" className="motion-reduce:hidden">
            <animateMotion dur={`${l.dur}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href={`#${l.id}`} />
            </animateMotion>
          </ellipse>
        </g>
      ))}
    </svg>

    {HUBS.map((h, i) => (
      <div key={h.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
        <span className="relative mx-auto block h-12 w-12">
          <span className="absolute -inset-3 animate-pulse rounded-full bg-glow/10 blur-md" style={{ animationDelay: `${i * 0.8}s` }} />
          <span className="absolute inset-0 animate-[spin_9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#5EEAD4,#8B5CF6,#34D399,#5EEAD4)]" />
          <span className="absolute inset-[2px] rounded-full bg-night-900" />
          <span className="absolute inset-[30%] rounded-full bg-gradient-to-br from-glow to-volt blur-[2px]" />
        </span>
        <span className="mt-1.5 block font-mono text-[10px] text-white/55">agent</span>
      </div>
    ))}

    {NODES.map((n, i) => (
      <div
        key={n.id}
        className="absolute -translate-x-1/2 -translate-y-1/2 animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none"
        style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${-i * 0.9}s` }}
      >
        <span className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-night-900/85 px-2.5 py-1.5 text-xs text-white/80 shadow-[0_8px_30px_-10px_rgba(0,0,0,.9)]">
          {n.icon ? <TechIcon name={n.label} icon={n.icon} size={16} /> : <Sparkles size={13} className={n.ai ? 'text-glow' : 'text-violet-300'} />}
          {n.label}
        </span>
      </div>
    ))}
  </div>
);

export default AgentNetwork;
