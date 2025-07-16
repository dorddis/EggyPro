# EggyPro - Premium Egg Protein E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

> A modern, full-stack e-commerce platform for premium egg protein products, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Beautiful product displays with detailed information
- **Shopping Cart**: Persistent cart with local storage
- **Inventory Management**: Real-time stock tracking and availability
- **Responsive Design**: Mobile-first design with smooth animations
- **Product Reviews**: Customer review system with ratings

### 🎨 Modern UI/UX
- **Component Library**: Comprehensive shadcn/ui component system
- **Animations**: Smooth scroll animations and micro-interactions
- **Loading States**: Skeleton loaders and loading spinners
- **Accessibility**: WCAG compliant with keyboard navigation
- **Dark/Light Mode**: Theme support (planned)

### 🚀 Performance
- **Static Generation**: Optimized for SEO and performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Intelligent caching strategies

### 🔧 Developer Experience
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Hot Reload**: Fast development with Turbopack

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/eggypro.git
   cd eggypro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database (for live products feature)
   POSTGRES_URL="your_vercel_postgres_url"
   
   # Admin Authentication
   ADMIN_SECRET_KEY="your_strong_admin_secret_key"
   
   # Cloudinary (for image management)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking

# Database (for live products)
npm run db:generate  # Generate database migrations
npm run db:migrate   # Apply database migrations
npm run db:studio    # Open Drizzle Studio
npm run seed         # Seed database with initial data

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📁 Project Structure

```
eggypro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── cart/              # Cart pages
│   │   ├── checkout/          # Checkout pages
│   │   ├── product/           # Product pages
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── cart/             # Cart components
│   │   ├── layout/           # Layout components
│   │   ├── product/          # Product components
│   │   ├── skeletons/        # Loading skeletons
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and configurations
│   │   ├── db/              # Database configuration
│   │   └── types.ts         # TypeScript types
│   └── services/            # Business logic services
├── docs/                     # Documentation
│   └── live-products/       # Live products implementation specs
├── public/                   # Static assets
├── scripts/                  # Build and deployment scripts
└── tests/                   # Test files
```

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend (Live Products Feature)
- **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** - Managed PostgreSQL database
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database ORM
- **[Cloudinary](https://cloudinary.com/)** - Image management service

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler
- **[Vitest](https://vitest.dev/)** - Unit testing

## 📚 Documentation

### Core Documentation
- **[Getting Started Guide](docs/getting-started.md)** - Complete setup instructions
- **[Component Library](docs/components.md)** - Available UI components
- **[API Reference](docs/api.md)** - API endpoints documentation
- **[Styling Guide](docs/styling.md)** - CSS and design system

### Live Products Implementation
- **[Master Specification](docs/live-products/master-spec.md)** - Overview of live products feature
- **[Database Schema](docs/live-products/database-schema-spec.md)** - Database design and schema
- **[API Endpoints](docs/live-products/api-endpoints-spec.md)** - RESTful API specification
- **[Backend Architecture](docs/live-products/backend-architecture-spec.md)** - System architecture
- **[Implementation Guide](docs/live-products/implementation-guide.md)** - Step-by-step implementation
- **[Refactor Plan](docs/live-products/refactor-plan.md)** - Migration strategy

### Development Guides
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project
- **[Code Style Guide](docs/code-style.md)** - Coding standards and conventions
- **[Testing Guide](docs/testing.md)** - Testing strategies and best practices
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions

## 🎯 Roadmap

### Phase 1: Core E-commerce (Current)
- ✅ Product catalog and details
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ Component library
- ✅ Basic checkout flow

### Phase 2: Live Products (In Progress)
- 🔄 Database integration
- 🔄 Admin interface
- 🔄 Inventory management
- 🔄 Image upload system
- 🔄 API endpoints

### Phase 3: Advanced Features (Planned)
- 📋 User authentication
- 📋 Order management
- 📋 Payment processing
- 📋 Email notifications
- 📋 Analytics dashboard

### Phase 4: Enterprise Features (Future)
- 📋 Multi-vendor support
- 📋 Advanced inventory
- 📋 Shipping integration
- 📋 Customer support
- 📋 Mobile app

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Quick Start for Contributors

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Setup

```bash
# Install dependencies
npm install

# Set up pre-commit hooks
npm run prepare

# Start development server
npm run dev

# Run tests
npm run test

# Check code quality
npm run lint
npm run typecheck
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** for the excellent component library
- **[Tailwind CSS](https://tailwindcss.com/)** for the utility-first CSS framework
- **[Vercel](https://vercel.com/)** for the amazing deployment platform
- **[Next.js](https://nextjs.org/)** team for the incredible React framework

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/eggypro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/eggypro/discussions)
- **Email**: support@eggypro.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/eggypro&type=Date)](https://star-history.com/#your-username/eggypro&Date)

---

**Made with ❤️ by the EggyPro Team**

*Empowering fitness enthusiasts with premium egg protein products.*
