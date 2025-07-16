# Contributing to EggyPro

Thank you for your interest in contributing to EggyPro! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Release Process](#release-process)

## 🤝 Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Using welcoming and inclusive language
- Being respectful of differing opinions, viewpoints, and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue to identify the problem
- **Describe the exact steps which reproduce the problem** in as many details as possible
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior
- **Explain which behavior you expected to see instead and why**
- **Include details about your configuration and environment**

### Suggesting Enhancements

If you have a suggestion for a new feature or an improvement to an existing feature, please:

- **Use a clear and descriptive title** for the issue
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead and why**

### Pull Requests

- Fork the repo and create your branch from `main`
- If you've added code that should be tested, add tests
- If you've changed APIs, update the documentation
- Ensure the test suite passes
- Make sure your code lints
- Issue that pull request!

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **Git** for version control

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/eggypro.git
   cd eggypro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see README.md for details)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Database Setup (for Live Products Feature)

If you're working on the live products feature:

1. **Set up Vercel Postgres database**
   - Create a new Postgres database in Vercel
   - Add the connection string to your `.env.local`

2. **Run database migrations**
   ```bash
   npm run db:generate  # Generate migration files
   npm run db:migrate   # Apply migrations
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- src/components/Button.test.tsx
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run typecheck

# Format code with Prettier
npm run format

# Check for security vulnerabilities
npm audit
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` type - use proper types or `unknown`
- Use interfaces for object shapes and types for unions/primitives

```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
}

type ProductStatus = 'in-stock' | 'out-of-stock' | 'discontinued';

// ❌ Bad
const product: any = { id: '1', name: 'Product' };
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Follow the naming convention: PascalCase for components
- Export components as default exports

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
```

### CSS/Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use semantic class names
- Avoid inline styles

```typescript
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Product Title</h2>
  <span className="text-lg font-bold text-primary">$29.99</span>
</div>

// ❌ Bad
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Product Title</h2>
</div>
```

### File Organization

- Use kebab-case for file names
- Group related files in directories
- Use index files for clean imports
- Follow the established project structure

```
src/
├── components/
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       └── index.ts
├── hooks/
│   ├── use-cart.ts
│   └── use-product.ts
└── lib/
    ├── types.ts
    └── utils.ts
```

### Git Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(cart): add persistent cart storage
fix(product): resolve image loading issue
docs(readme): update installation instructions
style(components): format code with prettier
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the coding standards**
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

2. **Update documentation** if you've changed APIs or added new features

3. **Add tests** for new functionality

4. **Update the changelog** if applicable

### Creating a Pull Request

1. **Fork the repository** if you haven't already

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit them
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist
- [ ] I have read the [Contributing Guidelines](CONTRIBUTING.md)
- [ ] My code follows the coding standards
- [ ] I have updated the documentation accordingly
- [ ] I have added tests for my changes
- [ ] All tests pass
```

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]

## Additional Context
Add any other context about the problem here
```

### Feature Requests

Use the feature request template:

```markdown
## Problem Statement
A clear and concise description of what the problem is

## Proposed Solution
A clear and concise description of what you want to happen

## Alternative Solutions
A clear and concise description of any alternative solutions you've considered

## Additional Context
Add any other context or screenshots about the feature request here
```

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/) for versioning:

- **MAJOR** version for incompatible API changes
- **MINOR** version for added functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

### Release Checklist

Before releasing a new version:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Version is bumped in `package.json`
- [ ] Release notes are prepared
- [ ] Deployment is tested

### Creating a Release

1. **Update version**
   ```bash
   npm version patch|minor|major
   ```

2. **Create release notes**
   - Summarize changes
   - List breaking changes
   - Include migration guide if needed

3. **Create GitHub release**
   - Tag the release
   - Add release notes
   - Attach build artifacts

## 📚 Additional Resources

- **[Code Style Guide](docs/code-style.md)** - Detailed coding standards
- **[Testing Guide](docs/testing.md)** - Testing strategies and best practices
- **[API Documentation](docs/api.md)** - API reference
- **[Component Library](docs/components.md)** - Available UI components

## 🤝 Getting Help

If you need help with contributing:

- **GitHub Issues**: [Create an issue](https://github.com/your-username/eggypro/issues)
- **GitHub Discussions**: [Start a discussion](https://github.com/your-username/eggypro/discussions)
- **Email**: contributors@eggypro.com

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** - List of contributors
- **Release notes** - Credit for significant contributions
- **GitHub profile** - Contribution graph and activity

---

**Thank you for contributing to EggyPro! 🎉**

*Together, we're building the future of e-commerce for fitness enthusiasts.* 