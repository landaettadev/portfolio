import { ArrowUpRight, ChevronDown, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Projects.css';

const projects = [
  { key: 'aiReports', art: 'reports', category: 'ai', tech: ['Python', 'Gemini', 'BigQuery', 'Cloud Run', 'Cloud Storage', 'SQL'], featured: true },
  { key: 'bitcoinATM', art: 'bitcoin', category: 'fintech', tech: ['C#', 'SQL Server', 'Web Forms', 'CoinPayments API', 'ASP.NET'] },
  { key: 'aiRetail', art: 'retail', category: 'ml', tech: ['Node.js', 'React', 'Python', 'Teradata', 'Machine Learning'] },
  { key: 'digitalGames', art: 'games', category: 'commerce', tech: ['Next.js', 'NestJS', 'PostgreSQL', 'Kinguin API', 'Redis', 'MeiliSearch', 'Wompi', 'CoinPal'], demo: 'https://popularkeys.com' },
  { key: 'smmPlatform', art: 'social', category: 'platform', tech: ['CodeIgniter', 'PHP', 'MySQL', 'SMM APIs', 'Payment Gateways'], demo: 'https://1popularity.com' },
  { key: 'enterpriseProjects', art: 'enterprise', category: 'enterprise', tech: ['Angular', 'C#', '.NET', 'SQL', 'MVC', 'PROXY'], wide: true },
];

export default function Projects() {
  const { t } = useTranslation();
  return (
    <section id="projects" className="section project-showcase" aria-labelledby="projects-heading">
      <div className="container mx-auto px-5 sm:px-6 lg:px-12">
        <div className="project-heading">
          <div>
            <h2 id="projects-heading" className="section-title">{t('projects.title')}</h2>
            <p className="section-lede">{t('projectsExtra.lede')}</p>
          </div>
          <p className="project-heading-note">{t('projectsExtra.range')}</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.key} className={`project-case ${project.featured ? 'project-case-featured' : ''} ${project.wide ? 'project-case-wide' : ''}`}>
              <figure className={`project-art project-art-${project.art}`}>
                <img src={`/assets/projects/${project.art}.svg`} alt={t(`projectsExtra.items.${project.key}.alt`)} width="960" height="600" loading="lazy" decoding="async" />
                <figcaption>{t('projectsExtra.concept')}</figcaption>
              </figure>
              <div className="project-copy">
                <div className="project-meta">
                  <span>{t(`projectsExtra.categories.${project.category}`)}</span>
                  {project.featured && <span className="project-pick">{t('projectsExtra.spotlight')}</span>}
                </div>
                <h3>{t(`projectsExtra.items.${project.key}.title`)}</h3>
                <p className="project-description">{t(`projectsExtra.items.${project.key}.summary`)}</p>
                <ul className="project-tech" aria-label={t('projectsExtra.stack')}>
                  {project.tech.slice(0, 4).map(tech => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="project-actions">
                  <details className="project-details">
                    <summary>{t('projectsExtra.details')}<ChevronDown size={17} aria-hidden="true" /></summary>
                    <div className="project-detail-body">
                      <p>{t(`projects.projects.${project.key}.description`)}</p>
                      <h4>{t('projectsExtra.stack')}</h4>
                      <p className="project-full-stack">{project.tech.join(' / ')}</p>
                    </div>
                  </details>
                  {project.demo && <a className="project-visit" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`${t('projectsExtra.visit')}: ${t(`projectsExtra.items.${project.key}.title`)}`}>{t('projectsExtra.visit')}<ArrowUpRight size={18} aria-hidden="true" /></a>}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="project-footer">
          <p>{t('projectsExtra.footer')}</p>
          <a href="https://github.com/landaettadev" target="_blank" rel="noopener noreferrer" className="project-github"><Github size={19} aria-hidden="true" />{t('projects.viewMore')}<ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
