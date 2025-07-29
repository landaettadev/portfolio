import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

const About: React.FC = () => {
  const { t } = useTranslation();
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      year: 'Jul 2024 – Jan 2025',
      title: t('about.positions.intern'),
      description: t('about.descriptions.intern'),
      icon: <Briefcase size={20} />,
    },
    {
      id: 2,
      year: '2020 - 2023',
      title: t('about.positions.fullstack'),
      description: t('about.descriptions.fullstack'),
      icon: <Briefcase size={20} />,
    },
    {
      id: 3,
      year: '2019 - Present',
      title: t('about.positions.freelance'),
      description: t('about.descriptions.freelance'),
      icon: <Briefcase size={20} />,
      link: 'landaettadev.com',
    },
    {
      id: 4,
      year: '2018 - 2020',
      title: t('about.positions.analyst'),
      description: t('about.descriptions.analyst'),
      icon: <Briefcase size={20} />,
    },
    {
      id: 5,
      year: '2017-2018',
      title: t('about.positions.junior'),
      description: t('about.descriptions.junior'),
      icon: <GraduationCap size={20} />,
    },
    {
      id: 6,
      year: '2015',
      title: t('about.positions.trainee'),
      description: t('about.descriptions.trainee'),
      icon: <Award size={20} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="section bg-bg-primary" ref={sectionRef}>
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="section-title">{t('about.title')}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div>
            <p className="text-lg text-text-muted mb-6">
              {t('about.description1')}
            </p>
            <p className="text-lg text-text-muted mb-6">
              {t('about.description2')}
            </p>
            <p className="text-lg text-text-muted">
              {t('about.description3')}
            </p>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card flex flex-col items-center p-4">
                <span className="text-2xl font-bold text-gradient">5+</span>
                <span className="text-sm text-text-muted mt-2">{t('about.yearsExperience')}</span>
              </div>
              <div className="card flex flex-col items-center p-4">
                <span className="text-2xl font-bold text-gradient">15+</span>
                <span className="text-sm text-text-muted mt-2">{t('about.projects')}</span>
              </div>
              <div className="card flex flex-col items-center p-4">
                <span className="text-2xl font-bold text-gradient">20+</span>
                <span className="text-sm text-text-muted mt-2">{t('about.techStack')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">{t('about.timeline')}</h3>
            
            <motion.div 
              className="relative pl-8 border-l border-slate-700 ml-2"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {timelineItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="mb-8 relative"
                  variants={itemVariants}
                >
                  <div className="absolute -left-[41px] bg-bg-primary p-2 rounded-full border border-slate-700">
                    {item.icon}
                  </div>
                  <span className="inline-block py-1 px-3 rounded-full bg-slate-800 text-xs text-text-muted mb-2">
                    {item.year}
                  </span>
                  <h4 className="text-lg font-semibold text-text-main flex items-center gap-2">
                    {item.title}
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </h4>
                  <p className="text-text-muted">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;