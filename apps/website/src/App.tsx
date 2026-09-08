import React, { useState } from 'react';
import { Button, Card, Input, Modal } from '@human-platform/ui';
import { useBoolean } from '@human-platform/hooks';
import { APP_NAME } from '@human-platform/constants';
import { LoginSchema } from '@human-platform/validation';
import './App.css';

export default function App() {
  const [isModalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.errors.forEach((err: any) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formattedErrors);
    } else {
      setSuccessMsg('Successfully validated credentials! Logging in...');
      setTimeout(() => {
        closeModal();
        setEmail('');
        setPassword('');
        setSuccessMsg('');
      }, 2000);
    }
  };

  return (
    <div className="landing-layout">
      {/* Header */}
      <header className="landing-header glass-panel">
        <div className="logo">{APP_NAME}</div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <Button variant="ghost" size="sm" onClick={openModal}>Sign In</Button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Connect. Build. Scale. <br />
          <span className="gradient-text">Human Intelligence & AI Workflows</span>
        </h1>
        <p className="hero-subtitle">
          The ultimate monorepo-driven operational hub uniting elite professionals and custom AI pipelines. Set up projects in seconds, validate schemas on the fly, and scale with peace of mind.
        </p>
        <div className="hero-cta">
          <Button variant="primary" size="lg" onClick={openModal}>Get Started Free</Button>
          <Button variant="ghost" size="lg" onClick={() => window.location.href = '#features'}>Learn More</Button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <h2 className="section-title">Core Ecosystem Features</h2>
        <div className="features-grid">
          <Card variant="glass" padding="lg">
            <h3 className="feature-title">NestJS API Core</h3>
            <p className="feature-desc">
              Strongly-typed backend running module-based domain entities. Integrated Swagger, custom error filters, and throttling policies.
            </p>
          </Card>
          <Card variant="glass" padding="lg">
            <h3 className="feature-title">React Native Apps</h3>
            <p className="feature-desc">
              Robust client applications for end-users, delivering push notifications, schedule coordination, and instant communication.
            </p>
          </Card>
          <Card variant="glass" padding="lg">
            <h3 className="feature-title">Decoupled Services</h3>
            <p className="feature-desc">
              Ready-to-scale sub-processes for background tasks: AI agents, webhooks, search indexing, and real-time WebSockets.
            </p>
          </Card>
        </div>
      </section>

      {/* Sign-in Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Welcome back">
        <form onSubmit={handleLoginSubmit} className="login-form">
          <p className="login-intro">Sign in to access your administrative portals.</p>
          
          {successMsg && <div className="success-banner">{successMsg}</div>}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button variant="primary" type="submit" fullWidth style={{ marginTop: '16px' }}>
            Authenticate Credentials
          </Button>
        </form>
      </Modal>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
}
