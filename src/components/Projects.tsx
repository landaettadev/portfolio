import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, X } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Projects data
  const projects: Project[] = [
    {
      id: 1,
      title: 'Bitcoin ATM System',
      description: 'Software tipo cajero C# y SQL desarrollado en web-forms consumiendo api de coinpayments para transacciones de criptomonedas.',
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['C#', 'SQL Server', 'Web Forms', 'CoinPayments API', 'ASP.NET'],
      demoUrl: 'https://cajero-bitcoin.com',
      githubUrl: 'https://github.com/landaettadev/bitcoin-atm',
      featured: true,
    },
    {
      id: 2,
      title: 'AI Retail Recommendation System',
      description: 'Sistema personalizado de recomendaciones en retail con IA utilizando algoritmos de machine learning para mejorar la experiencia del cliente.',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['Node.js', 'React', 'Python', 'Teradata', 'Machine Learning'],
      demoUrl: 'https://modulo-solo-para-ti.com',
      githubUrl: 'https://github.com/landaettadev/ai-retail-recommendations',
      featured: true,
    },
    {
      id: 3,
      title: 'Digital Games Store - DigitalDeluxes',
      description: 'Sitio web para la venta de videojuegos digitales desarrollado en PHP puro y MySQL, con consumo de APIs de Kinguin e integración de múltiples pasarelas de pago.',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['PHP', 'MySQL', 'Kinguin API', 'Payment Gateways'],
      githubUrl: '',
      featured: true,
    },
    {
      id: 6,
      title: 'AI-Powered Automated Reports System',
      description: 'Sistema personalizado para la creación de informes automáticos, integrada IA generativa con APIs y Google Cloud en Python y SQL (Cloud Run, Gemini, Storage, Big Query).',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['Python', 'Google Cloud', 'Cloud Run', 'Gemini AI', 'BigQuery', 'SQL'],
      demoUrl: '',
      githubUrl: '',
      featured: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="projects" className="section bg-bg-primary" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title text-center sm:text-left">Featured Projects</h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="group relative perspective-1000"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full transform-style-3d group-hover:rotate-y-3 group-hover:shadow-2xl">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 to-transparent"></div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-text-main">{project.title}</h3>
                  <p className="text-sm sm:text-base text-text-muted mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((tech, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-slate-800 text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-text-muted">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <a 
            href="https://github.com/landaettadev" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-secondary"
          >
            View More on GitHub
            <Github size={18} />
          </a>
        </div>
      </div>
      
      {/* Project Modal */}
      {selectedProject && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={closeProjectModal}
              className="absolute top-4 right-4 text-text-muted hover:text-text-main bg-slate-800/50 rounded-full p-2 transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <div className="relative h-48 sm:h-72 md:h-96 overflow-hidden">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{selectedProject.title}</h3>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <p className="text-text-muted mb-6">{selectedProject.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tech.map((tech, index) => (
                  <span 
                    key={index}
                    className="text-xs px-3 py-1 rounded-full bg-slate-800 text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;