import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      year: '2019 - Present',
      title: 'Freelance',
      description: 'As a versatile freelance full-stack developer and digital entrepreneur, I have architected and delivered e-commerce platforms and web applications—selling digital products and consulting services—using PHP (Laravel, CodeIgniter) and Python (Flask), with responsive front-ends built in HTML5, Tailwind CSS, and Vue.js/React; I’ve deployed and managed these solutions on Google Cloud Platform and cPanel hosting, automated CI/CD with Azure Pipelines and GitHub Actions, and implemented Python-based ETL and analytics scripts to ensure sub-200 ms response times, 99.5 %+ uptime, and seamless, data-driven user experiences.',
      icon: <Briefcase size={20} />,
      link: 'landaettadev.com',
    },
    {
      id: 2,
      year: 'Jul 2024 – Jan 2025',
      title: 'Software Development Intern',
      description: 'Designed and maintained web and desktop applications in C# and ASP .NET, improving functionality and support processes.Conducted database performance tuning and optimization for Microsoft SQL Server, reducing query times by up to 30 %.Provided technical support and training to end users, ensuring smooth adoption of software solutions.',
      icon: <Briefcase size={20} />,
    },
    {
      id: 3,
      year: '2018 - 2020',
      title: 'Software Analyst ',
      description: 'Designed and maintained web and desktop applications in C# and ASP .NET, improving functionality and support processes.Conducted database performance tuning and optimization for Microsoft SQL Server, reducing query times by up to 30 %.Provided technical support and training to end users, ensuring smooth adoption of software solutions.',
      icon: <Briefcase size={20} />,
    },
    {
      id: 4,
      year: '2017-2018',
      title: 'Junior Developer',
      description: 'Developed cryptocurrency point-of-sale applications in C# and ASP .NET, integrating hardware components and payment gateways.Collaborated on API design and implementation for secure transaction processing.Participated in code reviews and established unit testing practices to improve code quality.',
      icon: <GraduationCap size={20} />,
    },
    {
      id: 5,
      year: '2015',
      title: 'IT Technician Trainee ',
      description: 'Supported AS/400 system maintenance and performance monitoring for pricing and after-sales campaigns.Assisted in data management and reporting, using DB2 queries to inform business decisions.Coordinated with cross-functional teams to troubleshoot technical issues and optimize operational workflows.',
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
        <h2 className="section-title">About Me</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div>
            <p className="text-lg text-text-muted mb-6">
              I'm a passionate software engineer with over 5 years of experience building modern, 
              user-focused web applications. I specialize in crafting elegant, 
              performant interfaces that solve real problems.
            </p>
            <p className="text-lg text-text-muted mb-6">
              My approach combines technical excellence with user empathy, 
              ensuring that solutions are not only technically sound but 
              also intuitive and accessible for all users.
            </p>
            <p className="text-lg text-text-muted">
              I'm constantly learning and exploring new technologies, with a focus on 
              performance optimization, component architecture, and design systems.
            </p>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card flex flex-col items-center p-4">
                <span className="text-2xl font-bold text-gradient">5+</span>
                <span className="text-sm text-text-muted mt-2">Years Experience</span>
              </div>
              <div className="card flex flex-col items-center p-4">
                <span className="text-2xl font-bold text-gradient">30+</span>
                <span className="text-sm text-text-muted mt-2">Projects</span>
              </div>
              <div className="card flex flex-col items-center p-4">
                <span className="text-2xl font-bold text-gradient">15+</span>
                <span className="text-sm text-text-muted mt-2">Tech Stack</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Experience Timeline</h3>
            
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