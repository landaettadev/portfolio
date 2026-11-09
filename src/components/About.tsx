import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Nebula from './effects/Nebula';
import { Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import BarDigits from './effects/BarDigits';

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  org?: string;
}

/** One role: date, title, company and a description that expands on demand. */
const TimelineEntry: React.FC<{ item: TimelineItem; current: boolean }> = ({ item, current }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const id = `role-${item.id}`;
  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute -left-[49px] top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border bg-night-900 ${
          current ? 'border-glow/60 text-glow shadow-[0_0_0_4px_rgba(94,234,212,.08)]' : 'border-white/10 text-text-muted'
        }`}
      >
        {item.icon}
      </span>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-xs tracking-tight text-white/60">{item.year}</span>
        {current && <span className="rounded-full bg-leaf/10 px-2 py-0.5 text-[11px] font-medium text-leaf">{t('aboutExtra.current')}</span>}
      </div>
      <h4 className="mt-1.5 flex items-center gap-2 font-display text-lg font-semibold leading-snug text-white">
        {item.title}
        {item.link && (
          <a href={`https://${item.link}`} target="_blank" rel="noopener noreferrer" aria-label={item.link} className="-m-1.5 inline-flex rounded-md p-1.5 text-glow/80 transition-colors hover:text-glow">
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </h4>
      {item.org && <p className="text-sm text-white/70">{item.org}</p>}
      <p id={id} className={`mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-text-muted ${open ? '' : 'line-clamp-3'}`}>
        {item.description}
      </p>
      {item.description.length > 180 && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="mt-1 min-h-[32px] text-sm font-medium text-glow/90 transition-colors hover:text-glow"
        >
          {open ? t('aboutExtra.showLess') : t('aboutExtra.showMore')}
        </button>
      )}
    </>
  );
};

const About: React.FC = () => {
  const { t } = useTranslation();
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      year: '04/26 - Present',
      title: t('about.positions.haceb'),
      org: 'Industrias Haceb S.A.',
      description: t('about.descriptions.haceb'),
      icon: <Briefcase size={16} />,
    },
    {
      id: 2,
      year: '09/25 - 04/26',
      title: t('about.positions.eafit'),
      org: 'Universidad EAFIT',
      description: t('about.descriptions.eafit'),
      icon: <Briefcase size={16} />,
    },
    {
      id: 3,
      year: 'Jul 2024 – Jan 2025',
      title: t('about.positions.intern'),
      description: t('about.descriptions.intern'),
      icon: <Briefcase size={16} />,
    },
    {
      id: 4,
      year: '2020 - 2023',
      title: t('about.positions.fullstack'),
      description: t('about.descriptions.fullstack'),
      icon: <Briefcase size={16} />,
    },
    {
      id: 5,
      year: '2019 - Present',
      title: t('about.positions.freelance'),
      description: t('about.descriptions.freelance'),
      icon: <Briefcase size={16} />,
      link: 'landaettadev.com',
    },
    {
      id: 6,
      year: '2018 - 2020',
      title: t('about.positions.analyst'),
      description: t('about.descriptions.analyst'),
      icon: <Briefcase size={16} />,
    },
    {
      id: 7,
      year: '2017-2018',
      title: t('about.positions.junior'),
      description: t('about.descriptions.junior'),
      icon: <GraduationCap size={16} />,
    },
    {
      id: 8,
      year: '2015',
      title: t('about.positions.trainee'),
      description: t('about.descriptions.trainee'),
      icon: <Award size={16} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
      },
    },
  };

  return (
    <section id="about" className="section isolate" ref={sectionRef}>
      <Nebula variant="teal" className="-left-[15%] top-[10%] h-[600px] w-[60%]" />
      <div className="container mx-auto px-5 sm:px-6 lg:px-12">
        <div className="max-w-3xl">
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-lede">{t('aboutExtra.lede')}</p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="max-w-[60ch] space-y-5 text-[17px] leading-[1.75] text-text-muted">
              <p className="text-white/85">{t('about.description1')}</p>
              <p>{t('about.description2')}</p>
              <p>{t('about.description3')}</p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06]">
              {[
                ['+8', t('stats.years')],
                ['4', t('stats.agents')],
                ['2', t('stats.clouds')],
                ['30%', t('stats.query')],
              ].map(([n, l], i) => (
                <div key={l} className="bg-night-900 p-5">
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <BarDigits value={n} label={l} index={i} />
                    <span className="mt-3 block text-sm text-text-muted">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="mb-8 font-display text-xl font-semibold text-white">{t('about.timeline')}</h3>
            <motion.ol
              className="relative ml-5 pl-8 before:absolute before:bottom-4 before:left-0 before:top-4 before:w-px before:bg-gradient-to-b before:from-glow/70 before:via-volt/40 before:to-white/5"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {timelineItems.map((item, i) => (
                <motion.li key={item.id} className="relative pb-10 last:pb-0" variants={itemVariants}>
                  <TimelineEntry item={item} current={i === 0} />
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
