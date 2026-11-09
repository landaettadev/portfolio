const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';

export type Layer = 'ai' | 'cloud' | 'backend' | 'frontend' | 'data' | 'devops';

export interface Tech {
  name: string;
  layer: Layer;
  icon?: string;
}

const d = (slug: string, variant = 'original') => `${DEVICON}/${slug}/${slug}-${variant}.svg`;

export const TECH: Tech[] = [
  // AI
  { name: 'Copilot Studio', layer: 'ai' },
  { name: 'Azure AI Foundry', layer: 'ai', icon: d('azure') },
  { name: 'OpenAI', layer: 'ai' },
  { name: 'Gemini', layer: 'ai' },
  { name: 'BotFramework', layer: 'ai' },
  { name: 'Python ML', layer: 'ai', icon: d('python') },
  // Cloud
  { name: 'Azure', layer: 'cloud', icon: d('azure') },
  { name: 'Google Cloud', layer: 'cloud', icon: d('googlecloud') },
  { name: 'Cloud Run', layer: 'cloud', icon: d('googlecloud') },
  { name: 'App Services', layer: 'cloud', icon: d('azure') },
  { name: 'Application Insights', layer: 'cloud' },
  { name: 'MSAL / Entra ID', layer: 'cloud' },
  // Backend
  { name: '.NET / ASP.NET Core', layer: 'backend', icon: d('dotnetcore') },
  { name: 'C#', layer: 'backend', icon: d('csharp') },
  { name: 'Entity Framework', layer: 'backend' },
  { name: 'Node.js', layer: 'backend', icon: d('nodejs') },
  { name: 'Express', layer: 'backend', icon: d('express') },
  { name: 'PHP / Laravel', layer: 'backend', icon: d('php') },
  { name: 'REST + JWT', layer: 'backend' },
  // Frontend
  { name: 'Angular', layer: 'frontend', icon: d('angular') },
  { name: 'React', layer: 'frontend', icon: d('react') },
  { name: 'TypeScript', layer: 'frontend', icon: d('typescript') },
  { name: 'RxJS', layer: 'frontend', icon: d('rxjs') },
  { name: 'Tailwind CSS', layer: 'frontend', icon: d('tailwindcss') },
  { name: 'Vue.js', layer: 'frontend', icon: d('vuejs') },
  // Data
  { name: 'SQL Server', layer: 'data', icon: d('microsoftsqlserver', 'plain') },
  { name: 'BigQuery', layer: 'data', icon: d('googlecloud') },
  { name: 'PostgreSQL', layer: 'data', icon: d('postgresql') },
  { name: 'MySQL', layer: 'data', icon: d('mysql') },
  { name: 'MongoDB', layer: 'data', icon: d('mongodb') },
  { name: 'Teradata', layer: 'data' },
  // DevOps
  { name: 'GitHub Actions', layer: 'devops', icon: d('githubactions') },
  { name: 'Azure DevOps', layer: 'devops', icon: d('azuredevops') },
  { name: 'Docker', layer: 'devops', icon: d('docker') },
  { name: 'Git', layer: 'devops', icon: d('git') },
  { name: 'xUnit / Jest', layer: 'devops', icon: d('jest', 'plain') },
  { name: 'Postman / Swagger', layer: 'devops', icon: d('postman') },
];

export const MARQUEE: Tech[] = [
  { name: 'Azure', layer: 'cloud', icon: d('azure') },
  { name: 'Google Cloud', layer: 'cloud', icon: d('googlecloud') },
  { name: '.NET', layer: 'backend', icon: d('dotnetcore') },
  { name: 'Angular', layer: 'frontend', icon: d('angular') },
  { name: 'React', layer: 'frontend', icon: d('react') },
  { name: 'TypeScript', layer: 'frontend', icon: d('typescript') },
  { name: 'Python', layer: 'ai', icon: d('python') },
  { name: 'SQL Server', layer: 'data', icon: d('microsoftsqlserver', 'plain') },
  { name: 'Docker', layer: 'devops', icon: d('docker') },
  { name: 'GitHub Actions', layer: 'devops', icon: d('githubactions') },
  { name: 'PostgreSQL', layer: 'data', icon: d('postgresql') },
];
