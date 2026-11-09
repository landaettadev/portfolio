/**
 * Knowledge base for the portfolio assistant. Every answer is grounded in
 * Brandon's real experience; the local engine retrieves from here and the
 * optional /api/chat endpoint (Claude) receives the same facts server-side.
 */
export type Lang = 'es' | 'en';
type L = Record<Lang, string>;

export type ActionKind = 'scroll' | 'link' | 'whatsapp' | 'email';
export interface KAction {
  kind: ActionKind;
  label: L;
  target: string;
}

export interface Intent {
  id: string;
  /** shown as the "source" chip */
  source: L;
  /** normalized keywords (no accents). Multi-word phrases score higher. */
  keywords: string[];
  answer: L;
  /** deeper answer for "tell me more" follow-ups */
  more?: L;
  followups?: string[];
  actions?: KAction[];
  /** chip label when offered as a follow-up */
  chip: L;
  /** question sent when the chip is clicked */
  ask: L;
}

const CV: KAction = { kind: 'link', label: { es: 'Descargar CV', en: 'Download CV' }, target: 'cv' };
const CONTACT: KAction = { kind: 'scroll', label: { es: 'Ir a contacto', en: 'Go to contact' }, target: 'contact' };
const WA: KAction = { kind: 'whatsapp', label: { es: 'Escribir por WhatsApp', en: 'Message on WhatsApp' }, target: '+573006361659' };
const MAIL: KAction = { kind: 'email', label: { es: 'Enviar email', en: 'Send email' }, target: 'brandon@landaetta.dev' };

export const INTENTS: Intent[] = [
  {
    id: 'greeting',
    source: { es: 'Saludo', en: 'Greeting' },
    keywords: ['hola', 'hello', 'hi', 'hey', 'buenas', 'buenos dias', 'buenas tardes', 'good morning', 'que tal'],
    answer: {
      es: '¡Hola! Soy el agente del portafolio de Brandon. Conozco su experiencia, los agentes de IA que ha construido, su stack en Azure y Google Cloud y cómo contactarlo. ¿Qué te gustaría saber?',
      en: "Hi! I'm the agent behind Brandon's portfolio. I know his experience, the AI agents he has built, his Azure and Google Cloud stack and how to reach him. What would you like to know?",
    },
    followups: ['ai', 'experience', 'availability'],
    chip: { es: 'Saludar', en: 'Say hi' },
    ask: { es: 'Hola', en: 'Hi' },
  },
  {
    id: 'thanks',
    source: { es: 'Conversación', en: 'Conversation' },
    keywords: ['gracias', 'thanks', 'thank you', 'genial', 'perfecto', 'great', 'excelente', 'awesome'],
    answer: {
      es: 'Con gusto. Si quieres seguir la conversación con Brandon directamente, te dejo los atajos.',
      en: 'Happy to help. If you want to continue the conversation with Brandon directly, here are the shortcuts.',
    },
    actions: [CONTACT, WA],
    chip: { es: 'Gracias', en: 'Thanks' },
    ask: { es: 'Gracias', en: 'Thanks' },
  },
  {
    id: 'experience',
    source: { es: 'Experiencia', en: 'Experience' },
    keywords: ['experiencia', 'experience', 'trayectoria', 'career', 'carrera', 'anos', 'years', 'senior', 'background', 'perfil', 'profile', 'quien es', 'who is', 'sobre brandon', 'about brandon', 'resumen', 'summary'],
    answer: {
      es: 'Brandon tiene **9+ años** construyendo software en producción. Hoy es **Ingeniero de Software en Industrias Haceb**, con desarrollo full-stack en .NET, Angular y SQL Server sobre Azure y GCP. Antes, en **EAFIT**, construyó agentes conversacionales con Copilot Studio y Azure AI. Su carrera arrancó en soporte AS/400 y pasó por fintech (cajeros cripto), retail con ML y años de freelance.',
      en: "Brandon has **9+ years** shipping production software. He is currently a **Software Engineer at Industrias Haceb**, doing full-stack work with .NET, Angular and SQL Server on Azure and GCP. Before that, at **EAFIT**, he built conversational agents with Copilot Studio and Azure AI. His career started in AS/400 support and went through fintech (crypto ATMs), ML retail and years of freelancing.",
    },
    more: {
      es: 'Línea de tiempo:\n• **2026 – hoy** · Haceb: APIs, integración de sistemas y apps de negocio en Azure/GCP.\n• **2025 – 2026** · EAFIT: agentes en Copilot Studio, portal en Angular 20 con Signals, Azure AI Foundry, App Insights y MSAL.\n• **2024 – 2025** · Desarrollo C#/ASP.NET, consultas SQL Server 30% más rápidas.\n• **2020 – 2023** · Full-stack: inventarios e iluminación con ASP.NET Core, Angular y JWT.\n• **2019 – hoy** · Freelance: e-commerce, Laravel, Flask, GCP.\n• **2017 – 2020** · Cajeros Bitcoin en C# y análisis de software.',
      en: 'Timeline:\n• **2026 – now** · Haceb: APIs, system integration and business apps on Azure/GCP.\n• **2025 – 2026** · EAFIT: Copilot Studio agents, Angular 20 portal with Signals, Azure AI Foundry, App Insights and MSAL.\n• **2024 – 2025** · C#/ASP.NET development, SQL Server queries 30% faster.\n• **2020 – 2023** · Full-stack: inventory and lighting systems with ASP.NET Core, Angular and JWT.\n• **2019 – now** · Freelance: e-commerce, Laravel, Flask, GCP.\n• **2017 – 2020** · Bitcoin ATMs in C# and software analysis.',
    },
    followups: ['haceb', 'eafit', 'projects'],
    actions: [{ kind: 'scroll', label: { es: 'Ver cronología', en: 'See timeline' }, target: 'about' }, CV],
    chip: { es: 'Experiencia', en: 'Experience' },
    ask: { es: '¿Cuál es tu experiencia?', en: 'What is your experience?' },
  },
  {
    id: 'haceb',
    source: { es: 'Rol actual · Haceb', en: 'Current role · Haceb' },
    keywords: ['haceb', 'actual', 'actualmente', 'current', 'currently', 'trabajo actual', 'donde trabajas', 'where do you work', 'empresa'],
    answer: {
      es: 'En **Industrias Haceb** Brandon diseña y construye soluciones corporativas escalables: APIs, integración entre sistemas y aplicaciones de negocio con **.NET, Angular y SQL Server**, desplegadas en **Azure y Google Cloud**, con foco en rendimiento, seguridad y mantenibilidad bajo metodologías ágiles.',
      en: 'At **Industrias Haceb** Brandon designs and builds scalable corporate solutions: APIs, system integrations and business applications with **.NET, Angular and SQL Server**, deployed on **Azure and Google Cloud**, focused on performance, security and maintainability in agile teams.',
    },
    followups: ['cloud', 'backend', 'eafit'],
    chip: { es: 'Rol actual', en: 'Current role' },
    ask: { es: '¿Qué haces en Haceb?', en: 'What do you do at Haceb?' },
  },
  {
    id: 'eafit',
    source: { es: 'Agente de certificados · EAFIT', en: 'Certificates agent · EAFIT' },
    keywords: ['eafit', 'certificado', 'certificados', 'certificate', 'certificates', 'sapiencia', 'teams', 'tramite', 'universidad', 'university', 'estudiantes', 'students', 'copilot studio', 'agente de certificados', 'certificates agent'],
    answer: {
      es: 'En EAFIT construyó con **Copilot Studio** un agente para **Microsoft Teams** que asesora a estudiantes sobre certificados: consulta el **estado del trámite**, entrega el **código de descarga** cuando está listo y **valida las listas de Sapiencia**. Por detrás: API .NET, autenticación MSAL, respuestas generativas con Azure OpenAI y telemetría en Application Insights conforme a GDPR.',
      en: 'At EAFIT he built a **Copilot Studio** agent for **Microsoft Teams** that advises students on certificates: it checks the **request status**, hands over the **download code** when ready and **validates the Sapiencia lists**. Behind it: a .NET API, MSAL auth, generative answers with Azure OpenAI and GDPR-compliant Application Insights telemetry.',
    },
    more: {
      es: 'Detalles técnicos: 4 flujos conversacionales con lógica de negocio y prompts afinados; portal web en **Angular 20 (zoneless, Signals)** con RxJS y .NET Core; integración de **Azure AI Foundry, OpenAI y BotFramework WebChat**; estados de chat persistidos; e infraestructura en App Services, Bot Services y Application Insights. Puedes ver una traza simulada del agente en la sección "IA y Cloud".',
      en: 'Technical details: 4 conversational flows with business logic and tuned prompts; a web portal in **Angular 20 (zoneless, Signals)** with RxJS and .NET Core; **Azure AI Foundry, OpenAI and BotFramework WebChat** integration; persisted chat state; infrastructure on App Services, Bot Services and Application Insights. You can see a simulated trace of the agent in the "AI & Cloud" section.',
    },
    followups: ['ai', 'cloud', 'security'],
    actions: [{ kind: 'scroll', label: { es: 'Ver la traza del agente', en: 'See the agent trace' }, target: 'ai' }],
    chip: { es: 'Agente en Teams', en: 'Teams agent' },
    ask: { es: '¿Cómo funcionaba tu agente de certificados?', en: 'How did your certificates agent work?' },
  },
  {
    id: 'ai',
    source: { es: 'IA en producción', en: 'AI in production' },
    keywords: ['ia', 'ai', 'inteligencia artificial', 'artificial intelligence', 'agente', 'agentes', 'agent', 'agents', 'llm', 'genai', 'generativa', 'generative', 'openai', 'gemini', 'foundry', 'chatbot', 'bot', 'prompt', 'prompts', 'rag', 'machine learning', 'ml', 'copilot'],
    answer: {
      es: 'Brandon construye IA que llega a producción:\n• **Agentes conversacionales** en Copilot Studio integrados en Teams y portales corporativos.\n• **IA generativa sobre datos**: reportes automáticos con Gemini leyendo BigQuery desde Cloud Run.\n• **Recomendaciones con ML** en retail (Python sobre Teradata, servido a React).\n• **Observabilidad** de agentes con Application Insights.',
      en: 'Brandon builds AI that reaches production:\n• **Conversational agents** in Copilot Studio embedded in Teams and corporate portals.\n• **Generative AI on data**: automatic reports with Gemini reading BigQuery from Cloud Run.\n• **ML recommendations** for retail (Python over Teradata, served to React).\n• **Agent observability** with Application Insights.',
    },
    followups: ['eafit', 'aiReports', 'aiRetail'],
    actions: [{ kind: 'scroll', label: { es: 'Ver IA y Cloud', en: 'See AI & Cloud' }, target: 'ai' }],
    chip: { es: 'IA', en: 'AI' },
    ask: { es: '¿Qué has construido con IA?', en: 'What have you built with AI?' },
  },
  {
    id: 'cloud',
    source: { es: 'Cloud · Azure', en: 'Cloud · Azure' },
    keywords: ['azure', 'cloud', 'nube', 'app service', 'app services', 'bot service', 'application insights', 'app insights', 'devops', 'despliegue', 'deploy', 'infraestructura', 'infrastructure', 'entra', 'msal'],
    answer: {
      es: 'En **Azure** Brandon ha trabajado con App Services, Bot Services, Azure AI Foundry, Application Insights y autenticación con Entra ID/MSAL. Automatiza CI/CD con **Azure DevOps y GitHub Actions**.',
      en: 'On **Azure** Brandon has worked with App Services, Bot Services, Azure AI Foundry, Application Insights and Entra ID/MSAL authentication. He automates CI/CD with **Azure DevOps and GitHub Actions**.',
    },
    followups: ['gcp', 'devops', 'security'],
    chip: { es: 'Azure', en: 'Azure' },
    ask: { es: '¿Con qué servicios de Azure trabajas?', en: 'Which Azure services do you use?' },
  },
  {
    id: 'gcp',
    source: { es: 'Cloud · Google Cloud', en: 'Cloud · Google Cloud' },
    keywords: ['gcp', 'google cloud', 'google', 'cloud run', 'bigquery', 'big query', 'storage', 'vertex'],
    answer: {
      es: 'En **Google Cloud** ha desplegado servicios en **Cloud Run**, análisis en **BigQuery**, archivos en Storage y generación de contenido con **Gemini**. También alojó en GCP sus plataformas freelance.',
      en: 'On **Google Cloud** he has deployed services on **Cloud Run**, analytics on **BigQuery**, files on Storage and content generation with **Gemini**. He also hosted his freelance platforms on GCP.',
    },
    followups: ['aiReports', 'cloud'],
    chip: { es: 'Google Cloud', en: 'Google Cloud' },
    ask: { es: '¿Qué haces en Google Cloud?', en: 'What do you do on Google Cloud?' },
  },
  {
    id: 'tech',
    source: { es: 'Stack', en: 'Stack' },
    keywords: ['tecnologias', 'tecnologia', 'technologies', 'technology', 'stack', 'herramientas', 'tools', 'lenguajes', 'languages', 'skills', 'habilidades'],
    answer: {
      es: 'Stack por capas:\n• **IA**: Copilot Studio, Azure AI Foundry, OpenAI, Gemini, BotFramework.\n• **Cloud**: Azure, Google Cloud.\n• **Backend**: .NET / ASP.NET Core, C#, Entity Framework, Node.js, PHP.\n• **Frontend**: Angular (Signals), React, TypeScript, RxJS, Tailwind.\n• **Datos**: SQL Server, BigQuery, PostgreSQL, MySQL, MongoDB.\n• **DevOps**: GitHub Actions, Azure DevOps, Docker.',
      en: 'Stack by layer:\n• **AI**: Copilot Studio, Azure AI Foundry, OpenAI, Gemini, BotFramework.\n• **Cloud**: Azure, Google Cloud.\n• **Backend**: .NET / ASP.NET Core, C#, Entity Framework, Node.js, PHP.\n• **Frontend**: Angular (Signals), React, TypeScript, RxJS, Tailwind.\n• **Data**: SQL Server, BigQuery, PostgreSQL, MySQL, MongoDB.\n• **DevOps**: GitHub Actions, Azure DevOps, Docker.',
    },
    followups: ['backend', 'frontend', 'cloud'],
    actions: [{ kind: 'scroll', label: { es: 'Ver stack', en: 'See stack' }, target: 'stack' }],
    chip: { es: 'Tecnologías', en: 'Tech stack' },
    ask: { es: '¿Qué tecnologías usas?', en: 'What technologies do you use?' },
  },
  {
    id: 'backend',
    source: { es: 'Backend · .NET', en: 'Backend · .NET' },
    keywords: ['.net', 'net', 'dotnet', 'c#', 'csharp', 'asp.net', 'backend', 'api', 'apis', 'rest', 'entity framework', 'microservicios', 'microservices', 'clean architecture', 'solid'],
    answer: {
      es: 'Su base es **.NET y C#**: APIs REST con ASP.NET Core, Entity Framework, autenticación JWT/MSAL, integración entre sistemas y migración de sistemas legacy aplicando **SOLID y Clean Architecture**. Pruebas con xUnit/NUnit.',
      en: 'His foundation is **.NET and C#**: REST APIs with ASP.NET Core, Entity Framework, JWT/MSAL authentication, system integrations and legacy migrations applying **SOLID and Clean Architecture**. Testing with xUnit/NUnit.',
    },
    followups: ['data', 'frontend', 'security'],
    chip: { es: 'Backend .NET', en: '.NET backend' },
    ask: { es: '¿Qué haces con .NET?', en: 'What do you do with .NET?' },
  },
  {
    id: 'frontend',
    source: { es: 'Frontend', en: 'Frontend' },
    keywords: ['angular', 'react', 'frontend', 'front', 'typescript', 'signals', 'zoneless', 'rxjs', 'ui', 'ux', 'interfaz', 'vue', 'tailwind', 'web', 'desarrollo web', 'web development', 'aplicaciones web', 'web apps', 'web app', 'portales', 'portals', 'sitios', 'websites', 'paginas'],
    answer: {
      es: 'En frontend trabaja con **Angular moderno** (v20 zoneless con Signals y RxJS) y **React** con TypeScript. Este mismo sitio está hecho en React + Vite + Tailwind + Framer Motion.',
      en: 'On the frontend he works with **modern Angular** (v20 zoneless with Signals and RxJS) and **React** with TypeScript. This very site is built with React + Vite + Tailwind + Framer Motion.',
    },
    followups: ['site', 'backend'],
    chip: { es: 'Frontend', en: 'Frontend' },
    ask: { es: '¿Qué usas en frontend?', en: 'What do you use on the frontend?' },
  },
  {
    id: 'data',
    source: { es: 'Datos', en: 'Data' },
    keywords: ['sql', 'sql server', 'base de datos', 'bases de datos', 'database', 'databases', 'postgres', 'postgresql', 'mysql', 'mongodb', 'teradata', 'datos', 'data', 'etl', 'consultas', 'queries', 'optimizacion'],
    answer: {
      es: 'Domina **SQL Server** (afinó consultas hasta un **30% más rápidas**), además de PostgreSQL, MySQL, MongoDB, Teradata y BigQuery. Ha escrito ETL y análisis en Python.',
      en: 'He is strong in **SQL Server** (tuned queries to run up to **30% faster**), plus PostgreSQL, MySQL, MongoDB, Teradata and BigQuery. He has written ETL and analytics in Python.',
    },
    followups: ['aiReports', 'backend'],
    chip: { es: 'Datos', en: 'Data' },
    ask: { es: '¿Qué bases de datos manejas?', en: 'Which databases do you use?' },
  },
  {
    id: 'devops',
    source: { es: 'DevOps', en: 'DevOps' },
    keywords: ['ci', 'cd', 'ci/cd', 'pipeline', 'pipelines', 'github actions', 'azure devops', 'docker', 'git', 'testing', 'pruebas', 'tests', 'jest', 'xunit'],
    answer: {
      es: 'Automatiza entregas con **GitHub Actions y Azure DevOps**, contenedores con **Docker** y pruebas con xUnit, NUnit, Jest y Jasmine. En freelance sostuvo **99.5%+ de uptime** y respuestas por debajo de 200 ms.',
      en: 'He automates delivery with **GitHub Actions and Azure DevOps**, containers with **Docker** and tests with xUnit, NUnit, Jest and Jasmine. In freelance work he kept **99.5%+ uptime** and sub-200 ms responses.',
    },
    followups: ['cloud', 'backend'],
    chip: { es: 'DevOps', en: 'DevOps' },
    ask: { es: '¿Cómo manejas CI/CD?', en: 'How do you handle CI/CD?' },
  },
  {
    id: 'security',
    source: { es: 'Seguridad', en: 'Security' },
    keywords: ['seguridad', 'security', 'autenticacion', 'authentication', 'jwt', 'gdpr', 'privacidad', 'privacy', 'oauth', 'sso'],
    answer: {
      es: 'Aplica autenticación corporativa con **MSAL / Entra ID** y **JWT**, y telemetría conforme a **GDPR** en Application Insights. La seguridad entra desde el diseño de la API, no al final.',
      en: 'He applies corporate authentication with **MSAL / Entra ID** and **JWT**, and **GDPR**-compliant telemetry in Application Insights. Security goes in at API design, not at the end.',
    },
    followups: ['backend', 'cloud'],
    chip: { es: 'Seguridad', en: 'Security' },
    ask: { es: '¿Cómo abordas la seguridad?', en: 'How do you approach security?' },
  },
  {
    id: 'projects',
    source: { es: 'Proyectos', en: 'Projects' },
    keywords: ['proyectos', 'proyecto', 'projects', 'project', 'portafolio', 'portfolio', 'trabajos', 'casos', 'cases', 'hecho', 'built', 'construido'],
    answer: {
      es: 'Proyectos destacados:\n• **Reportes automáticos con IA** (Gemini, BigQuery, Cloud Run).\n• **Recomendaciones "Solo para ti"** en retail con ML.\n• **Software de cajero Bitcoin** en C# con CoinPayments.\n• **DigitalDeluxes**, tienda de juegos digitales con múltiples pasarelas.\n• **1popularity**, plataforma SMM en CodeIgniter.\n• Proyectos empresariales en Angular, C# y .NET.',
      en: 'Featured projects:\n• **Automated AI reports** (Gemini, BigQuery, Cloud Run).\n• **"Just for you" retail recommendations** with ML.\n• **Bitcoin ATM software** in C# with CoinPayments.\n• **DigitalDeluxes**, a digital games store with multiple payment gateways.\n• **1popularity**, an SMM platform in CodeIgniter.\n• Enterprise projects in Angular, C# and .NET.',
    },
    followups: ['aiReports', 'aiRetail', 'bitcoin'],
    actions: [{ kind: 'scroll', label: { es: 'Ver proyectos', en: 'See projects' }, target: 'projects' }],
    chip: { es: 'Proyectos', en: 'Projects' },
    ask: { es: 'Cuéntame sobre tus proyectos', en: 'Tell me about your projects' },
  },
  {
    id: 'aiReports',
    source: { es: 'Proyecto · Reportes IA', en: 'Project · AI reports' },
    keywords: ['reportes', 'reports', 'informes', 'reporting', 'gemini', 'automatizado', 'automated'],
    answer: {
      es: 'Sistema de **reportes automáticos con IA generativa**: Python sobre **Cloud Run** consulta **BigQuery**, **Gemini** redacta el informe y el resultado queda en Storage, listo para negocio.',
      en: 'An **automated reporting system with generative AI**: Python on **Cloud Run** queries **BigQuery**, **Gemini** writes the report and the output lands in Storage, ready for the business.',
    },
    followups: ['gcp', 'aiRetail'],
    chip: { es: 'Reportes con IA', en: 'AI reports' },
    ask: { es: 'Háblame de los reportes con IA', en: 'Tell me about the AI reports' },
  },
  {
    id: 'aiRetail',
    source: { es: 'Proyecto · Retail ML', en: 'Project · Retail ML' },
    keywords: ['retail', 'recomendaciones', 'recommendations', 'recomendacion', 'solo para ti', 'just for you', 'teradata'],
    answer: {
      es: 'Módulo **"Solo para ti"**: recomendaciones personalizadas en retail con modelos de machine learning en **Python sobre Teradata**, expuestas con Node.js a una interfaz en **React**.',
      en: '**"Just for you"** module: personalized retail recommendations with machine-learning models in **Python over Teradata**, exposed through Node.js to a **React** interface.',
    },
    followups: ['aiReports', 'data'],
    chip: { es: 'Retail con ML', en: 'Retail ML' },
    ask: { es: '¿Cómo era el sistema de recomendaciones?', en: 'How did the recommendation system work?' },
  },
  {
    id: 'bitcoin',
    source: { es: 'Proyecto · Cajero Bitcoin', en: 'Project · Bitcoin ATM' },
    keywords: ['bitcoin', 'cripto', 'crypto', 'cajero', 'atm', 'coinpayments', 'blockchain', 'pagos', 'payments', 'pasarelas'],
    answer: {
      es: 'Desarrolló **software de cajero Bitcoin** en C# y ASP.NET Web Forms con SQL Server, integrando la API de CoinPayments, hardware de punto de venta y procesamiento seguro de transacciones.',
      en: 'He built **Bitcoin ATM software** in C# and ASP.NET Web Forms with SQL Server, integrating the CoinPayments API, point-of-sale hardware and secure transaction processing.',
    },
    followups: ['projects', 'backend'],
    chip: { es: 'Cajero Bitcoin', en: 'Bitcoin ATM' },
    ask: { es: 'Cuéntame del cajero Bitcoin', en: 'Tell me about the Bitcoin ATM' },
  },
  {
    id: 'availability',
    source: { es: 'Disponibilidad', en: 'Availability' },
    keywords: ['disponible', 'disponibilidad', 'available', 'availability', 'contratar', 'hire', 'hiring', 'contratacion', 'oportunidad', 'opportunity', 'oferta', 'vacante', 'job', 'empleo', 'remoto', 'remote', 'freelance', 'consultoria', 'consulting', 'proyecto nuevo'],
    answer: {
      es: 'Sí, Brandon está **abierto a nuevos retos**: roles de ingeniería con IA y cloud, y proyectos puntuales de agentes o integración. Trabaja en remoto con equipos internacionales.',
      en: 'Yes, Brandon is **open to new challenges**: engineering roles in AI and cloud, and focused projects on agents or integrations. He works remotely with international teams.',
    },
    followups: ['contact', 'why'],
    actions: [CONTACT, WA],
    chip: { es: 'Disponibilidad', en: 'Availability' },
    ask: { es: '¿Estás disponible para contratar?', en: 'Are you available for hire?' },
  },
  {
    id: 'why',
    source: { es: 'Perfil', en: 'Profile' },
    keywords: ['por que', 'why', 'contratarte', 'hire you', 'fortalezas', 'strengths', 'diferencia', 'diferencial', 'valor', 'value', 'mejor', 'best', 'destacas'],
    answer: {
      es: 'Tres razones: **1)** lleva IA a producción con métricas y seguridad, no solo demos; **2)** cubre la pila completa, del prompt al API .NET y la base de datos; **3)** tiene 9+ años entregando en entornos corporativos, fintech y retail.',
      en: "Three reasons: **1)** he takes AI to production with metrics and security, not just demos; **2)** he covers the full stack, from the prompt to the .NET API and the database; **3)** he has 9+ years shipping in corporate, fintech and retail environments.",
    },
    followups: ['eafit', 'availability'],
    actions: [CV],
    chip: { es: '¿Por qué Brandon?', en: 'Why Brandon?' },
    ask: { es: '¿Por qué debería contratarte?', en: 'Why should I hire you?' },
  },
  {
    id: 'education',
    source: { es: 'Formación', en: 'Education' },
    keywords: ['educacion', 'education', 'estudios', 'estudio', 'study', 'studies', 'universidad', 'titulo', 'degree', 'formacion', 'ingeniero', 'engineer'],
    answer: {
      es: 'Brandon es **Ingeniero de Software**, con formación técnica en TI desde 2015, y se mantiene al día en IA generativa y cloud. Su CV tiene el detalle académico.',
      en: 'Brandon is a **Software Engineer**, with IT technical training since 2015, and keeps current on generative AI and cloud. His CV has the academic details.',
    },
    actions: [CV],
    chip: { es: 'Formación', en: 'Education' },
    ask: { es: '¿Qué estudiaste?', en: 'What did you study?' },
  },
  {
    id: 'contact',
    source: { es: 'Contacto', en: 'Contact' },
    keywords: ['contacto', 'contact', 'contactar', 'contactarte', 'reach', 'hablar', 'talk', 'escribir', 'llamar', 'call', 'email', 'correo', 'mail', 'telefono', 'phone', 'celular', 'whatsapp', 'linkedin'],
    answer: {
      es: 'Puedes escribirle a **brandon@landaetta.dev** o por **WhatsApp al +57 300 636 1659**. También está el formulario de contacto al final de la página.',
      en: 'You can email **brandon@landaetta.dev** or message him on **WhatsApp at +57 300 636 1659**. There is also a contact form at the end of the page.',
    },
    actions: [MAIL, WA, CONTACT],
    chip: { es: 'Contacto', en: 'Contact' },
    ask: { es: '¿Cómo puedo contactarte?', en: 'How can I contact you?' },
  },
  {
    id: 'cv',
    source: { es: 'CV', en: 'CV' },
    keywords: ['cv', 'curriculum', 'hoja de vida', 'resume', 'descargar', 'download', 'pdf'],
    answer: {
      es: 'Aquí tienes el CV actualizado de Brandon en PDF.',
      en: "Here is Brandon's up-to-date CV as a PDF.",
    },
    actions: [CV],
    chip: { es: 'CV', en: 'CV' },
    ask: { es: '¿Dónde descargo tu CV?', en: 'Where can I download your CV?' },
  },
  {
    id: 'location',
    source: { es: 'Ubicación', en: 'Location' },
    keywords: ['ubicacion', 'ubicado', 'location', 'based', 'vives', 'live', 'ciudad', 'city', 'pais', 'country', 'colombia', 'medellin', 'zona horaria', 'timezone'],
    answer: {
      es: 'Brandon está en **Colombia** (zona horaria GMT-5) y trabaja en remoto con equipos de cualquier lugar.',
      en: 'Brandon is based in **Colombia** (GMT-5) and works remotely with teams anywhere.',
    },
    followups: ['availability'],
    chip: { es: 'Ubicación', en: 'Location' },
    ask: { es: '¿Dónde estás ubicado?', en: 'Where are you based?' },
  },
  {
    id: 'site',
    source: { es: 'Este sitio', en: 'This site' },
    keywords: ['sitio', 'site', 'pagina', 'page', 'web', 'este asistente', 'this assistant', 'como funcionas', 'how do you work', 'quien eres', 'who are you'],
    answer: {
      es: 'Soy un agente que responde con base en la experiencia real de Brandon. Cuando está disponible, uso **Claude** para redactar; si no, un motor local que entiende intención, contexto y errores de escritura. El sitio está hecho con React, Vite, Tailwind y Framer Motion.',
      en: "I'm an agent that answers from Brandon's real experience. When available I use **Claude** to write; otherwise a local engine that understands intent, context and typos. The site is built with React, Vite, Tailwind and Framer Motion.",
    },
    followups: ['ai', 'frontend'],
    chip: { es: '¿Cómo funcionas?', en: 'How do you work?' },
    ask: { es: '¿Cómo funcionas?', en: 'How do you work?' },
  },
];

export const START_CHIPS = ['eafit', 'experience', 'tech', 'availability', 'projects', 'contact'];

/** Plain-text profile used as grounding for the remote model. */
export const profileText = (lang: Lang) =>
  INTENTS.filter((i) => !['greeting', 'thanks'].includes(i.id))
    .map((i) => `## ${i.source[lang]}\n${i.answer[lang]}${i.more ? `\n${i.more[lang]}` : ''}`)
    .join('\n\n');
