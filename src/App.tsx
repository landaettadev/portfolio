import { lazy, Suspense } from 'react';
import Header from './components/Header';

const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Stack = lazy(() => import('./components/Stack'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-main">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Stack />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </div>
  );
}

export default App;