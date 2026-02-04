# Architecture Documentation

## 📐 Project Structure

```
portfolio/
├── public/              # Static assets
│   ├── assets/         # Images, icons
│   └── cv-*.pdf        # CV files (EN/ES)
├── src/
│   ├── components/     # React components
│   ├── config/         # App configuration
│   ├── constants/      # Global constants
│   ├── locales/        # i18n translations
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   ├── i18n.ts         # i18n setup
│   └── index.css       # Global styles
└── ...config files
```

## 🏗️ Technology Stack

### Core
- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **Custom CSS** - Animations & special effects

### Animation
- **Framer Motion 11.0** - Advanced animations
- **Intersection Observer** - Scroll-based triggers

### Internationalization
- **i18next 25.3** - Translation framework
- **react-i18next 15.6** - React bindings

### Features
- **EmailJS** - Contact form
- **Fuse.js** - Search functionality
- **Lucide React** - Icon library

## 🎯 Design Patterns

### Component Architecture

#### 1. Lazy Loading
All major sections use React.lazy() for code splitting:
```tsx
const Hero = lazy(() => import('./components/Hero'));
```

#### 2. Error Boundaries
Catch and handle component errors gracefully:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### 3. Suspense Boundaries
Show loading states during code splitting:
```tsx
<Suspense fallback={<LoadingSpinner />}>
  <Component />
</Suspense>
```

### State Management

- **Local State**: useState for component-level state
- **Context**: i18n context for language switching
- **Refs**: Canvas animations, DOM manipulation

### Performance Optimizations

#### Code Splitting
- Route-level splitting with React.lazy()
- Manual chunk splitting in Vite config
- Vendor bundle separation

#### Asset Optimization
- Lazy loading images with `loading="lazy"`
- SVG optimization
- Font preloading

#### Runtime Optimization
- RequestAnimationFrame for animations
- Debounced scroll handlers
- Intersection Observer for visibility

## 🔄 Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
State Update / API Call
    ↓
Re-render / Side Effect
    ↓
DOM Update
```

## 🎨 Styling Architecture

### Tailwind Configuration
```javascript
// Custom colors, fonts, animations
theme: {
  extend: {
    colors: { /* custom palette */ },
    fontFamily: { /* Inter, Fira Code */ },
    animation: { /* custom animations */ }
  }
}
```

### CSS Organization
1. **Tailwind Base** - Reset & base styles
2. **Components** - Reusable component styles
3. **Utilities** - Custom utility classes
4. **Accessibility** - SR-only, focus styles

## 🌐 Internationalization

### Structure
```
locales/
├── en/
│   └── translation.json
└── es/
    └── translation.json
```

### Usage
```tsx
const { t } = useTranslation();
return <h1>{t('hero.title')}</h1>;
```

## 🔐 Security Considerations

- No sensitive data in frontend
- Environment variables for API keys
- Sanitized user inputs
- HTTPS only in production
- CSP headers recommended

## 📊 Performance Metrics

### Target Scores
- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1

### Optimization Strategies
1. Code splitting by route
2. Image lazy loading
3. CSS minimization
4. JS tree shaking
5. Gzip compression

## 🧪 Testing Strategy

### Unit Tests (Planned)
- Component rendering
- User interactions
- Utility functions

### Integration Tests (Planned)
- Form submissions
- Navigation flows
- Language switching

### E2E Tests (Planned)
- Critical user journeys
- Cross-browser testing
- Accessibility testing

## 🚀 Build & Deployment

### Build Process
```bash
npm run build
```

Output:
```
dist/
├── assets/         # Hashed assets
├── index.html      # Entry HTML
└── ...chunks       # JS/CSS chunks
```

### Deployment Targets
- **Primary**: Netlify/Vercel
- **CDN**: CloudFlare
- **DNS**: Custom domain

### Environment Variables
```
VITE_API_URL=
VITE_GA_ID=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

## 📈 Future Improvements

### Phase 1
- [ ] Unit test coverage (70%+)
- [ ] PWA support
- [ ] Blog section with MDX

### Phase 2
- [ ] Dark/Light mode toggle
- [ ] Advanced analytics
- [ ] CMS integration

### Phase 3
- [ ] A/B testing framework
- [ ] Performance monitoring
- [ ] User feedback system

## 🔧 Maintenance

### Regular Tasks
- Dependency updates (monthly)
- Security audits (quarterly)
- Performance audits (quarterly)
- Accessibility audits (quarterly)

### Monitoring
- Error tracking (Sentry recommended)
- Analytics (Google Analytics)
- Uptime monitoring
- Performance metrics

---

Last updated: 2026-02-04
