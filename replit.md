# SADS.FUN - Solana Autonomous Discovery System

## Overview

SADS.FUN is a quantum-themed web application for analyzing and predicting potential risks in Solana blockchain entities (wallets and tokens). The platform provides a futuristic, interactive interface featuring 3D WebGL visualizations, predictive analytics, and multiple informational pages. Built with a full-stack TypeScript architecture, it combines Express.js backend with React frontend to deliver real-time risk assessment through visually stunning orbital simulations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **3D Graphics**: Three.js for WebGL-based orbital visualizations and quantum orb rendering
- **Animations**: Framer Motion for page transitions and UI animations
- **Font Strategy**: Custom fonts (PP Neue Montreal, PPSupplyMono) loaded via CDN

**Key Pages**:
- `/` - Nexus (home page with 3D holographic background)
- `/app` - Predictive Console (main analysis interface with quantum orb)
- `/orbiverse` - Entity visualization gallery
- `/docs` - Documentation with code examples
- `/roadmap` - Timeline of development phases
- `/contact` - Contact information

**Design Pattern**: The application uses a dark, cosmic aesthetic with purple accent colors (#ccaaff, #b374ff), featuring animated backgrounds and WebGL-rendered 3D elements. Mobile-responsive with device detection for performance optimization.

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Build Strategy**: ESBuild for server bundling with selective dependency bundling (allowlist approach to reduce syscalls for faster cold starts)
- **Development Mode**: Vite middleware integration for HMR during development
- **Session Management**: Configured for express-session (ready for PostgreSQL session store via connect-pg-simple)
- **Static Serving**: Serves built client from `dist/public` in production

**API Design**: RESTful endpoints with Zod schema validation
- `/api/predict` - POST endpoint for risk prediction analysis
- Returns structured predictions including Temporal Fragility Index (TFI), Quantum Similarity Score (QSS), risk windows, and similar past cases

**Data Flow**: Currently uses in-memory storage (`MemStorage` class) for user data with interfaces designed for easy migration to PostgreSQL via Drizzle ORM.

### Database Strategy

**ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` defines database tables and validation schemas
- **Migration Path**: `./migrations` directory
- **Current State**: Database schema is defined but application runs on in-memory storage; `IStorage` interface abstracts storage layer for seamless transition

**Schema Design**:
- Users table with UUID primary keys
- Prediction schemas using Zod for runtime validation
- Shared types between client and server via `@shared` path alias

**Rationale**: The storage abstraction allows development without database dependencies while maintaining production-ready architecture. When PostgreSQL is added, only the storage implementation needs to change.

### Validation & Type Safety

**Approach**: Shared schema definitions between frontend and backend
- Drizzle-Zod integration for automatic schema generation from database models
- Zod schemas for API request/response validation
- TypeScript path aliases (`@/`, `@shared/`) for clean imports

**Benefits**: Single source of truth for data structures, compile-time type safety, runtime validation, reduced code duplication.

### Build & Deployment

**Production Build Process**:
1. Client build via Vite → outputs to `dist/public`
2. Server build via ESBuild → outputs to `dist/index.cjs`
3. Selective bundling of dependencies reduces file system overhead

**Development Workflow**:
- Concurrent dev servers: Vite dev server (port 5000) + Express server
- Hot module replacement for instant client updates
- TypeScript checking via `tsc --noEmit`

**Replit-Specific Features**:
- Cartographer plugin (dev only) for Replit code navigation
- Dev banner plugin for Replit environment
- Runtime error modal overlay
- Meta images plugin for dynamic OpenGraph image URLs
- Deployment URL detection for proper asset serving

### Performance Optimizations

**Device Detection**: Adjusts quality settings based on device capabilities
- Lower particle counts on mobile devices
- Reduced pixel ratio on mobile (1.5x vs 2x)
- Safari-specific optimizations
- Hardware concurrency checks for low-power devices

**WebGL Optimization**: Three.js scenes use:
- Reduced sphere counts on mobile
- Adaptive rendering based on FPS
- Efficient geometry reuse
- Mouse position interpolation for smooth interactions

## External Dependencies

### UI Component Library
- **shadcn/ui**: Comprehensive React component library built on Radix UI primitives
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library

### State & Data Management
- **TanStack Query**: Server state management with caching
- **React Hook Form**: Form handling with Zod resolver integration
- **Zod**: Schema validation library

### Visualization & Graphics
- **Three.js**: 3D WebGL rendering for quantum orb and background effects
- **Framer Motion**: Animation library for page transitions and UI elements

### Backend Infrastructure
- **Express.js**: Web server framework
- **Drizzle ORM**: Type-safe SQL ORM for PostgreSQL
- **connect-pg-simple**: PostgreSQL session store adapter (configured, not yet active)

### Build Tools
- **Vite**: Frontend build tool and dev server
- **ESBuild**: Server-side bundling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

### Development Tools
- **TypeScript**: Type safety across entire codebase
- **Wouter**: Lightweight routing library
- **nanoid**: Unique ID generation

### Fonts & Typography
- **PP Neue Montreal**: Primary sans-serif font (via CDN)
- **PPSupplyMono**: Monospace font for code/technical elements (via CodePen CDN)

### Session Management (Configured)
- **express-session**: Session middleware
- **memorystore**: In-memory session store (current)
- **connect-pg-simple**: PostgreSQL session store (ready for migration)

**Note**: The application is designed to add PostgreSQL database connectivity when needed. All database schemas and session configuration are in place, currently using in-memory fallbacks for development ease.