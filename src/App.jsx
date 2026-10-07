import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const modules = [
  'Overview',
  'Prospects',
  'Qualified Leads',
  'Outreach',
  'Buying Intent',
  'Meetings',
  'Clients',
  'Onboarding',
  'BPO Partners',
  'Delivery',
  'Retention & Upsell',
  'Analytics'
];

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('Overview');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading Moerat Command Center...</div>;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">M</div>
          <div>
            <strong>MOERAT</strong>
            <span>Customer Solutions</span>
          </div>
        </div>

        <nav>
          {modules.map((module) => (
            <button
              key={module}
              className={activeModule === module ? 'nav active' : 'nav'}
              onClick={() => setActiveModule(module)}
            >
              {module}
            </button>
          ))}
        </nav>

        <button className="logout" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">MOERAT CUSTOMER SOLUTIONS</p>
            <h1>{activeModule}</h1>
          </div>

          <div className="user">
            {session.user.email}
          </div>
        </header>

        {activeModule === 'Overview' ? (
          <Overview />
        ) : (
          <ModulePlaceholder name={activeModule} />
        )}
      </main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
    }

    setBusy(false);
  }

  async function createAccount() {
    setBusy(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Account created. Check your email if confirmation is required.');
    }

    setBusy(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo large">M</div>
        <p className="eyebrow">MOERAT CUSTOMER SOLUTIONS</p>
        <h1>Command Center</h1>
        <p className="muted">
          AI-powered acquisition, sales and BPO operations.
        </p>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Business email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button className="primary" disabled={busy}>
            {busy ? 'Please wait...' : 'Sign in'}
          </button>
        </form>

        <button className="secondary" onClick={createAccount} disabled={busy}>
          Create account
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState({
    prospects: 0,
    qualified: 0,
    meetings: 0,
    clients: 0
  });

  useEffect(() => {
    async function loadStats() {
      const [prospects, qualified, meetings, clients] = await Promise.all([
        supabase.from('prospects').select('*', { count: 'exact', head: true }),
        supabase.from('qualified_leads').select('*', { count: 'exact', head: true }),
        supabase.from('meetings').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        prospects: prospects.count || 0,
        qualified: qualified.count || 0,
        meetings: meetings.count || 0,
        clients: clients.count || 0
      });
    }

    loadStats();
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span className="status">● SYSTEM READY</span>
          <h2>Global AI Acquisition Engine</h2>
          <p>
            Discover → Research → Deduplicate → Score → Qualify → Engage →
            Meeting → Human Close → Delivery
          </p>
        </div>
      </section>

      <section className="stats">
        <Stat title="Processing Target" value="200K+" subtitle="prospects / day" />
        <Stat title="Monthly Target" value="6M+" subtitle="prospects processed" />
        <Stat title="Qualified Target" value="300+" subtitle="opportunities / day" />
        <Stat title="Real Prospects" value={stats.prospects} subtitle="in database" />
      </section>

      <section className="grid">
        <div className="panel">
          <h3>Live Database</h3>
          <div className="rows">
            <Row label="Prospects" value={stats.prospects} />
            <Row label="Qualified Leads" value={stats.qualified} />
            <Row label="Meetings" value={stats.meetings} />
            <Row label="Clients" value={stats.clients} />
          </div>
        </div>

        <div className="panel">
          <h3>Human Closing Layer</h3>
          <div className="person">
            <strong>Mohammed</strong>
            <span>Sales & Closing</span>
          </div>
          <div className="person">
            <strong>Thaamir</strong>
            <span>Sales & Closing</span>
          </div>
        </div>
      </section>
    </>
  );
}

function ModulePlaceholder({ name }) {
  return (
    <div className="panel large-panel">
      <span className="status">● CONNECTED</span>
      <h2>{name}</h2>
      <p>
        This module is connected to the Moerat operating system foundation.
        The production workflows will be activated as each module is built.
      </p>
    </div>
  );
}

function Stat({ title, value, subtitle }) {
  return (
    <div className="stat">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
             }
