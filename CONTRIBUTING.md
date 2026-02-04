# Contributing to Brandon Landaetta Portfolio

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/landaettadev/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Development Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### Commit Messages
Follow conventional commits format:
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(hero): add parallax effect to background
fix(contact): resolve email validation issue
docs(readme): update installation instructions
```

## 🧪 Testing

Before submitting a PR:
```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## 📋 Code Style

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` types
- Use `const` over `let` when possible

### React
- Use functional components with hooks
- Use lazy loading for route-level components
- Implement proper error boundaries
- Follow component structure:
  ```tsx
  // 1. Imports
  // 2. Types/Interfaces
  // 3. Component
  // 4. Styles (if any)
  // 5. Export
  ```

### CSS/Tailwind
- Use Tailwind utility classes
- Custom CSS only when necessary
- Follow BEM naming for custom classes
- Keep styles modular

## 🎨 Accessibility Guidelines

- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Maintain color contrast ratios (WCAG AA)
- Test with screen readers
- Include focus indicators

## 📦 Adding Dependencies

Before adding new dependencies:
1. Check if similar functionality exists
2. Verify package is actively maintained
3. Check bundle size impact
4. Document reason in PR

## 🐛 Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## ✨ Feature Requests

Include:
- Clear use case
- Proposed solution
- Alternative solutions considered
- Impact assessment

## 📄 Pull Request Process

1. Update documentation
2. Add/update tests if needed
3. Ensure all checks pass
4. Request review from maintainer
5. Address review feedback
6. Squash commits before merge

## 🔍 Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Changes are well-documented
- [ ] No console.log statements
- [ ] Accessibility standards met
- [ ] Performance impact considered
- [ ] Responsive design verified
- [ ] Cross-browser tested

## 📞 Questions?

Open an issue or contact: brandon@landaetta.dev

Thank you for contributing! 🎉
