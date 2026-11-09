import { lazy, Suspense, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Background from './components/Background';
import Hero from './components/Hero';
import { onIdle, scrollToSection } from './hooks/useSpotlight';

const AgentTrace = lazy(() => import('./components/AgentTrace'));
const About = lazy(() => import('./components/About'));
const Stack = lazy(() => import('./components/Stack'));
const RibbonText = lazy(() => import('./components/effects/RibbonText'));
const Projects = lazy(() => import('./components/Projects'));
const ShaderCTA = lazy(() => import('./components/effects/ShaderCTA'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

// Below-the-fold sections, mounted one per idle slot so first load never runs one long task.
const SECTIONS: { id: string; C: LazyExoticComponent<ComponentType> }[] = [
  { id: 'ai', C: AgentTrace },
  { id: 'about', C: About },
  { id: 'stack', C: Stack },
  { id: 'ribbon', C: RibbonText },
  { id: 'projects', C: Projects },
  { id: 'cta', C: ShaderCTA },
  { id: 'contact', C: Contact },
  { id: 'footer', C: Footer },
];

const useProgressiveMount = (total: number) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= total) return;
    return onIdle(() => setCount((c) => c + 1), 900);
  }, [count, total]);

  // Jumping to a section (header link, palette, shared URL) needs every section in the DOM.
  useEffect(() => {
    const all = () => setCount(total);
    const toHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      all();
      if (id && id !== 'main-content') scrollToSection(id);
    };
    if (window.location.hash) toHash();
    window.addEventListener('hashchange', toHash);
    window.addEventListener('mount:all', all);
    return () => {
      window.removeEventListener('hashchange', toHash);
      window.removeEventListener('mount:all', all);
    };
  }, [total]);
  return count;
};

const SectionFallback = () => <div className="min-h-[60vh]" aria-hidden="true" />;

function App() {
  const mounted = useProgressiveMount(SECTIONS.length);
  const main = SECTIONS.filter((s) => s.id !== 'footer');

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-bg-primary text-text-main">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-night-950"
        >
          Skip to main content
        </a>
        <Background />
        <Header />
        <main id="main-content" tabIndex={-1} className="relative z-10 overflow-x-clip outline-none">
          <Hero />
          {main.map(({ id, C }, i) =>
            i < mounted ? (
              <Suspense key={id} fallback={<SectionFallback />}>
                <C />
              </Suspense>
            ) : (
              <SectionFallback key={id} />
            )
          )}
        </main>
        {mounted >= SECTIONS.length && (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <AIAssistant />
          <CommandPalette />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
