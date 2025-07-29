import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TechStack {
  id: number;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'design' | 'devops' | 'database' | 'mobile';
}

const Stack: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Tech stack data
  const technologies: TechStack[] = [
    // Languages
    { id: 1, name: 'C#', icon: 'csharp', category: 'backend' },
    { id: 2, name: 'JavaScript', icon: 'javascript', category: 'frontend' },
    { id: 3, name: 'TypeScript', icon: 'typescript', category: 'frontend' },
    { id: 4, name: 'SQL', icon: 'sql', category: 'database' },
    { id: 5, name: 'Python', icon: 'python', category: 'backend' },
    
    // Frontend
    { id: 6, name: 'Angular', icon: 'angular', category: 'frontend' },
    { id: 7, name: 'React', icon: 'react', category: 'frontend' },
    { id: 8, name: 'HTML5', icon: 'html5', category: 'frontend' },
    { id: 9, name: 'CSS3', icon: 'css3', category: 'frontend' },
    { id: 10, name: 'Bootstrap', icon: 'bootstrap', category: 'frontend' },
    { id: 11, name: 'RxJS', icon: 'rxjs', category: 'frontend' },
    
    // Backend
    { id: 12, name: 'ASP.NET Core', icon: 'dotnet', category: 'backend' },
    { id: 13, name: 'Entity Framework', icon: 'ef', category: 'backend' },
    { id: 14, name: 'Node.js', icon: 'nodejs', category: 'backend' },
    { id: 15, name: 'Express.js', icon: 'express', category: 'backend' },
    { id: 16, name: 'RESTful APIs', icon: 'api', category: 'backend' },
    { id: 17, name: 'JWT', icon: 'jwt', category: 'backend' },
    
    // Testing
    { id: 18, name: 'xUnit', icon: 'xunit', category: 'frontend' },
    { id: 19, name: 'Jest', icon: 'jest', category: 'frontend' },
    { id: 20, name: 'Jasmine', icon: 'jasmine', category: 'frontend' },
    { id: 21, name: 'Postman', icon: 'postman', category: 'devops' },
    { id: 22, name: 'Swagger', icon: 'swagger', category: 'devops' },
    { id: 23, name: 'NUnit', icon: 'nunit', category: 'frontend' },
    
    // Databases
    { id: 24, name: 'SQL Server', icon: 'sqlserver', category: 'database' },
    { id: 25, name: 'PostgreSQL', icon: 'postgresql', category: 'database' },
    { id: 26, name: 'MySQL', icon: 'mysql', category: 'database' },
    { id: 27, name: 'Teradata', icon: 'teradata', category: 'database' },
    { id: 28, name: 'MongoDB', icon: 'mongodb', category: 'database' },
    
    // DevOps & Tools
    { id: 29, name: 'Git', icon: 'git', category: 'devops' },
    { id: 30, name: 'GitHub', icon: 'github', category: 'devops' },
    { id: 31, name: 'GitHub Actions', icon: 'githubactions', category: 'devops' },
    { id: 32, name: 'Azure DevOps', icon: 'azure', category: 'devops' },
    { id: 33, name: 'Docker', icon: 'docker', category: 'devops' },
    { id: 34, name: 'Visual Studio', icon: 'vs', category: 'devops' },
    { id: 35, name: 'VS Code', icon: 'vscode', category: 'devops' },
    
    // Cloud & CI/CD
    { id: 36, name: 'Azure', icon: 'azure', category: 'devops' },
    { id: 37, name: 'Google Cloud', icon: 'gcp', category: 'devops' },
    { id: 38, name: 'cPanel', icon: 'cpanel', category: 'devops' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'devops', label: 'DevOps' },
  ];

  const filteredTech = filter === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // This is a simplified version since we're not actually including SVG icons
  // In a real project, you would import actual SVG icons or use an icon library
  const TechIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    return (
      <div className={`flex items-center justify-center h-12 w-12 bg-slate-800 rounded-lg text-blue-500 ${className || ''}`}>
        {/* This would be replaced with an actual icon */}
        <span className="text-sm font-mono">{name.substring(0, 2).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <section id="stack" className="section bg-bg-primary/50" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title text-center sm:text-left">Tech Stack</h2>
        
        <div className="flex flex-wrap gap-2 mt-6 sm:mt-8 justify-center sm:justify-start">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
                filter === category.id
                  ? 'bg-accent-gradient text-white'
                  : 'bg-slate-800 text-text-muted hover:bg-slate-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-6 sm:mt-10"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {filteredTech.map(tech => (
            <motion.div
              key={tech.id}
              className="card flex flex-col items-center justify-center p-3 sm:p-4 hover:scale-105 transition-transform"
              variants={itemVariants}
            >
              <TechIcon name={tech.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
              <h3 className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-text-main text-center">{tech.name}</h3>
              <span className="text-[10px] sm:text-xs text-text-muted mt-1 capitalize">{tech.category}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stack;