import { useState } from 'react';
import { Card } from '@human-platform/ui';
import { APP_NAME } from '@human-platform/constants';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<'intro' | 'monorepo' | 'packages' | 'db'>('intro');

  return (
    <div className="docs-layout">
      {/* Sidebar */}
      <aside className="docs-sidebar glass-panel">
        <div className="logo">{APP_NAME} <span className="logo-badge">Docs</span></div>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('intro')} className={`nav-item ${activeTab === 'intro' ? 'active' : ''}`}>
            Introduction
          </button>
          <button onClick={() => setActiveTab('monorepo')} className={`nav-item ${activeTab === 'monorepo' ? 'active' : ''}`}>
            Monorepo Structure
          </button>
          <button onClick={() => setActiveTab('packages')} className={`nav-item ${activeTab === 'packages' ? 'active' : ''}`}>
            Shared Packages
          </button>
          <button onClick={() => setActiveTab('db')} className={`nav-item ${activeTab === 'db' ? 'active' : ''}`}>
            Database Architecture
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="docs-main">
        <header className="docs-header glass-panel">
          <h1 className="docs-title">Developer Reference</h1>
          <div className="docs-version">v1.0.0 Stable</div>
        </header>

        <div className="docs-content glass-panel">
          {activeTab === 'intro' && (
            <div className="docs-section">
              <h2>Introduction</h2>
              <p>
                Welcome to the <strong>{APP_NAME} Developer Ecosystem</strong>. This platform is organized as a high-scale startup monorepo to ensure seamless collaboration between user-facing frontend applications, microservices, and shared configuration guidelines.
              </p>
              <p>
                Our tools are built using <strong>pnpm workspaces</strong> to guarantee fast installations and strictly isolated dependencies, managed concurrently via <strong>Turborepo</strong>.
              </p>
              <Card variant="glass" className="notice-card">
                <h3>Getting Started Quick Tip</h3>
                <p>Run <code>pnpm install</code> in the root folder to bootstrap the entire repository. Start all dev servers simultaneously using <code>pnpm run dev</code>.</p>
              </Card>
            </div>
          )}

          {activeTab === 'monorepo' && (
            <div className="docs-section">
              <h2>Monorepo Layout</h2>
              <p>The workspace is split into three main logical folders:</p>
              <ul>
                <li><strong>apps/</strong>: User-facing frontend applications (Vite portals & React Native apps).</li>
                <li><strong>services/</strong>: Backend applications, with <code>services/api</code> running NestJS as the main gateway, and other sub-services supporting AI, search, and WebSockets.</li>
                <li><strong>packages/</strong>: Reusable libraries, config presets, UI components, and TypeScript models.</li>
              </ul>
              <pre className="code-block">
{`human-platform/
├── apps/
│   ├── mobile/             # React Native Client
│   ├── website/            # Marketing Landing Page
│   └── admin/              # Management Panel
├── services/
│   └── api/                # NestJS API Core
└── packages/
    ├── ui/                 # Vanilla CSS Component Library
    └── types/              # Domain Models`}
              </pre>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="docs-section">
              <h2>Shared Package Registry</h2>
              <p>
                Shared modules inside the <code>packages/</code> folder are linked directly in local workspaces, allowing rapid development cycles without publishing to npm.
              </p>
              <div className="packages-grid">
                <Card variant="bordered" padding="sm">
                  <h4>@human-platform/ui</h4>
                  <p>Vanilla CSS custom component library.</p>
                </Card>
                <Card variant="bordered" padding="sm">
                  <h4>@human-platform/theme</h4>
                  <p>Design token maps and CSS style variables.</p>
                </Card>
                <Card variant="bordered" padding="sm">
                  <h4>@human-platform/validation</h4>
                  <p>Zod validator schemas for inputs.</p>
                </Card>
                <Card variant="bordered" padding="sm">
                  <h4>@human-platform/api-client</h4>
                  <p>Shared HTTP module wrapping Axios.</p>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="docs-section">
              <h2>Database Architecture</h2>
              <p>
                The project uses PostgreSQL as its primary data store, managed via the <strong>Prisma ORM</strong>. The schema is centralized to keep models decoupled from any single runtime.
              </p>
              <p>Central schema location: <code>database/prisma/schema.prisma</code></p>
              <pre className="code-block">
{`// Generate database clients:
pnpm run prisma:generate

// Push migrations to PostgreSQL:
pnpm run prisma:migrate:dev`}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
