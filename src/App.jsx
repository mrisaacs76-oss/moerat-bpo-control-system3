import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const modules = [
  'Overview',
  'Businesses',
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

const businessTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'operations', label: 'Operations' },
  { id: 'finance', label: 'Finance' },
  { id: 'people', label: 'People' },
  { id: 'customers', label: 'Customers' },
  { id: 'partners', label: 'Partners' },
  { id: 'ai-systems', label: 'AI Systems' },
  { id: 'performance', label: 'Performance' },
  { id: 'risk-security', label: 'Risk & Security' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity' }
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

          <div className="user">{session.user.email}</div>
        </header>

        {activeModule === 'Overview' ? (
          <Overview />
        ) : activeModule === 'Businesses' ? (
          <BusinessesModule />
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

function BusinessesModule() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setBusinesses(data || []);

        if ((data || []).length > 0) {
          setSelectedId((currentId) => currentId ?? data[0].id);
        }
      } catch (err) {
        setBusinesses([]);
        setSelectedId(null);
        setError(err.message || 'Unable to load businesses from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, []);

  const selectedBusiness =
    businesses.find((business) => business.id === selectedId) || businesses[0] || null;

  if (loading) {
    return (
      <div className="panel loading-panel">
        <span className="status">● LOADING</span>
        <h2>Business Management</h2>
        <p className="muted">Loading business records from Supabase…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel error-panel">
        <span className="status status-warning">● DATA UNAVAILABLE</span>
        <h2>Business Management</h2>
        <p className="muted">
          Supabase business data is not available right now. The management UI is
          ready, but the data layer is not connected yet.
        </p>
        <p className="error-copy">{error}</p>
      </div>
    );
  }

  return (
    <div className="business-management">
      <aside className="business-directory panel">
        <div className="business-directory-header">
          <h3>Business Directory</h3>
          <span className="meta-badge">{businesses.length} records</span>
        </div>

        {businesses.length === 0 ? (
          <p className="muted">No businesses returned from Supabase.</p>
        ) : (
          businesses.map((business) => {
            const name = business.name || business.business_name || 'Untitled Business';
            const statusText = getBusinessStatusText(business);

            return (
              <button
                key={business.id}
                type="button"
                className={
                  selectedBusiness && selectedBusiness.id === business.id
                    ? 'business-card active'
                    : 'business-card'
                }
                onClick={() => setSelectedId(business.id)}
              >
                <div className="business-card-row">
                  <strong>{name}</strong>
                  <span className={`status-badge ${getBusinessStatusClass(business)}`}>
                    {statusText}
                  </span>
                </div>
                <small>{business.industry || business.business_type || 'Business record'}</small>
                <small>
                  {business.location || business.city || business.country || 'Location not connected'}
                </small>
              </button>
            );
          })
        )}
      </aside>

      <section className="business-detail-wrap">
        {selectedBusiness ? (
          <>
            <header className="business-header panel">
              <div>
                <p className="eyebrow">MNI BUSINESS MANAGEMENT</p>
                <h2>{selectedBusiness.name || selectedBusiness.business_name || 'Business record'}</h2>
              </div>
              <div className="business-header-right">
                <span className={`status-badge ${getBusinessStatusClass(selectedBusiness)}`}>
                  {getBusinessStatusText(selectedBusiness)}
                </span>
              </div>
            </header>

            <nav className="business-tabs panel" aria-label="Business sections">
              {businessTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={activeTab === tab.id ? 'tab-button active' : 'tab-button'}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="tab-panel panel">
              <BusinessTabContent tab={activeTab} business={selectedBusiness} />
            </div>
          </>
        ) : (
          <div className="panel">
            <h2>No business selected</h2>
            <p className="muted">Select a business from the directory to open the management view.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function BusinessTabContent({ tab, business }) {
  switch (tab) {
    case 'overview':
      return <OverviewSection business={business} />;
    case 'operations':
      return <ComingSoonSection title="Operations" tag="Not Connected" />;
    case 'finance':
      return <ComingSoonSection title="Finance" tag="Not Connected" />;
    case 'people':
      return <ComingSoonSection title="People" tag="Coming Soon" />;
    case 'customers':
      return <ComingSoonSection title="Customers" tag="Coming Soon" />;
    case 'partners':
      return <ComingSoonSection title="Partners" tag="Not Connected" />;
    case 'ai-systems':
      return <ComingSoonSection title="AI Systems" tag="Not Connected" />;
    case 'performance':
      return <ComingSoonSection title="Performance" tag="Coming Soon" />;
    case 'risk-security':
      return <ComingSoonSection title="Risk & Security" tag="Coming Soon" />;
    case 'documents':
      return <ComingSoonSection title="Documents" tag="Coming Soon" />;
    case 'activity':
      return <ComingSoonSection title="Activity" tag="Not Connected" />;
    default:
      return <OverviewSection business={business} />;
  }
}

function OverviewSection({ business }) {
  const summaryItems = [
    { label: 'Status', value: getBusinessStatusText(business) },
    { label: 'Industry', value: business.industry || business.business_type || 'Not connected' },
    { label: 'Location', value: business.location || business.city || business.country || 'Not connected' },
    { label: 'Primary Contact', value: business.contact_name || business.owner_name || 'Not connected' },
    { label: 'Email', value: business.contact_email || business.email || 'Not connected' },
    { label: 'Phone', value: business.contact_phone || business.phone || 'Not connected' },
    { label: 'Updated', value: formatDate(business.updated_at || business.modified_at) }
  ];

  return (
    <div className="business-section-grid">
      <div className="panel summary-panel">
        <h3>Business Summary</h3>
        <div className="detail-list">
          {summaryItems.map((item) => (
            <BusinessField key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>

      <div className="panel summary-panel">
        <h3>Management Snapshot</h3>
        <div className="snapshot-boxes">
          <div className="snapshot-box">
            <span>Business Name</span>
            <strong>{business.name || business.business_name || 'Not connected'}</strong>
          </div>
          <div className="snapshot-box">
            <span>Owner</span>
            <strong>{business.owner_name || business.contact_name || 'Not connected'}</strong>
          </div>
          <div className="snapshot-box">
            <span>Region</span>
            <strong>{business.region || business.country || 'Not connected'}</strong>
          </div>
          <div className="snapshot-box">
            <span>Record Status</span>
            <strong>{getBusinessStatusText(business)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoonSection({ title, tag = 'Coming Soon' }) {
  return (
    <div className="coming-soon-wrap">
      <div className="coming-soon-banner">{tag}</div>
      <h3>{title}</h3>
      <p className="muted">
        This MNI business section is scaffolded for the frontend and is not yet connected to
        Supabase data or business workflows.
      </p>
      <div className="placeholder-grid">
        <div className="placeholder-card">Not Connected</div>
        <div className="placeholder-card">Pending MNI config</div>
        <div className="placeholder-card">Future workflow</div>
      </div>
    </div>
  );
}

function BusinessField({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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

function getBusinessStatusText(business) {
  if (!business) {
    return 'Unknown';
  }

  const raw =
    business.status ||
    business.business_status ||
    business.state ||
    business.record_status ||
    business.lifecycle_status ||
    'active';

  return String(raw).replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getBusinessStatusClass(business) {
  const raw = (business?.status || business?.business_status || business?.state || '').toLowerCase();

  if (raw.includes('inactive') || raw.includes('archived') || raw.includes('closed')) {
    return 'danger';
  }

  if (raw.includes('pending') || raw.includes('review') || raw.includes('trial')) {
    return 'warning';
  }

  return 'success';
}

function formatDate(value) {
  if (!value) {
    return 'Not connected';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not connected';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
