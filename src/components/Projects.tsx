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
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce solution with cart, checkout, and payment processing. Includes admin dashboard and analytics.',
      image: 'https://images.pexels.com/photos/6956903/pexels-photo-6956903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
      demoUrl: 'https://example.com/demo1',
      githubUrl: 'https://github.com/username/ecommerce',
      featured: true,
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management platform with real-time updates, notifications, and team management features.',
      image: 'https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['React', 'Firebase', 'Material UI', 'TypeScript'],
      demoUrl: 'https://example.com/demo2',
      githubUrl: 'https://github.com/username/task-app',
      featured: true,
    },
    {
      id: 3,
      title: 'Real Estate Listing Platform',
      description: 'A property listing website with search, filters, and user accounts. Features map integration and saved searches.',
      image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Google Maps API'],
      demoUrl: 'https://example.com/demo3',
      githubUrl: 'https://github.com/username/real-estate',
      featured: false,
    },
    {
      id: 4,
      title: 'Social Media Dashboard',
      description: 'A comprehensive dashboard for social media management with analytics, scheduling, and content management.',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['Vue.js', 'Express', 'D3.js', 'OAuth'],
      demoUrl: 'https://example.com/demo4',
      githubUrl: 'https://github.com/username/social-dashboard',
      featured: true,
    },
    {
      id: 5,
      title: 'Fitness Tracking App',
      description: 'A mobile-first web application for tracking workouts, nutrition, and progress with personalized recommendations.',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['React Native', 'GraphQL', 'Node.js', 'MongoDB'],
      demoUrl: 'https://example.com/demo5',
      githubUrl: 'https://github.com/username/fitness-app',
      featured: false,
    },
    {
      id: 6,
      title: 'Weather Forecast App',
      description: 'A beautiful weather application with 7-day forecasts, location search, and animated weather visualizations.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tech: ['React', 'OpenWeather API', 'Chart.js', 'Geolocation API'],
      demoUrl: 'https://example.com/demo6',
      githubUrl: 'https://github.com/username/weather-app',
      featured: false,
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
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      View Code
                    </a>
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
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Live Demo
                </a>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View Code
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;