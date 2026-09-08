import { useState } from 'react';
import { Button, Card, Input, Modal } from '@human-platform/ui';
import { useBoolean } from '@human-platform/hooks';
import { APP_NAME } from '@human-platform/constants';
import './App.css';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
}

interface VerificationRequestItem {
  id: string;
  userName: string;
  userEmail: string;
  category: string;
  claimedOrg: string;
  emailVerified: boolean;
  docName: string;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications'>('overview');
  const [isSettingsOpen, { setTrue: openSettings, setFalse: closeSettings }] = useBoolean(false);
  const [users, setUsers] = useState<AdminUser[]>([
    { id: '1', name: 'Devin AI', email: 'devin@ai.com', role: 'expert', status: 'active' },
    { id: '2', name: 'John Doe', email: 'john@doe.com', role: 'user', status: 'active' },
    { id: '3', name: 'Sarah Smith', email: 'sarah@design.co', role: 'expert', status: 'pending' },
    { id: '4', name: 'Michael Scott', email: 'm.scott@dundermifflin.com', role: 'org_admin', status: 'suspended' },
  ]);

  const [verifications, setVerifications] = useState<VerificationRequestItem[]>([
    {
      id: 'v-101',
      userName: 'Alexander Wright',
      userEmail: 'alex@google.com',
      category: 'Corporate Career',
      claimedOrg: 'Google (Sr. Software Engineer)',
      emailVerified: true,
      docName: 'Google_Offer_Letter.pdf',
      submittedAt: '10 mins ago',
      status: 'PENDING_REVIEW',
    },
    {
      id: 'v-102',
      userName: 'Dr. Emily Vance',
      userEmail: 'emily@stanford.edu',
      category: 'Higher Education',
      claimedOrg: 'Stanford University (PhD Computer Science)',
      emailVerified: true,
      docName: 'Stanford_Degree_Certificate.pdf',
      submittedAt: '45 mins ago',
      status: 'PENDING_REVIEW',
    },
  ]);

  const [systemMessage, setSystemMessage] = useState('Welcome to Human Platform internal admin hub.');

  const handleStatusChange = (id: string, newStatus: 'active' | 'suspended') => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
    );
  };

  const handleApproveVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'APPROVED' } : v))
    );
    alert('Verification Approved! User activated as Verified Expert with Badge.');
  };

  const handleRejectVerification = (id: string) => {
    const reason = prompt('Enter rejection reason for user:');
    if (reason) {
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: 'REJECTED' } : v))
      );
      alert(`Verification Rejected. Reason sent: "${reason}"`);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-panel">
        <div className="logo">{APP_NAME} <span className="logo-badge">Admin</span></div>
        <nav className="sidebar-nav">
          <a
            href="#"
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
          >
            Dashboard Overview
          </a>
          <a
            href="#"
            className={`nav-item ${activeTab === 'verifications' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('verifications'); }}
          >
            Verification Queue ({verifications.filter(v => v.status === 'PENDING_REVIEW').length})
          </a>
        </nav>
        <div className="sidebar-footer">
          <Button variant="ghost" size="sm" onClick={openSettings} className="w-full">
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header glass-panel">
          <h1 className="admin-page-title">
            {activeTab === 'overview' ? 'Dashboard Overview' : 'Stage 1 Expert Verification Queue'}
          </h1>
          <div className="admin-user-profile">
            <span className="profile-role">Super Admin</span>
            <div className="avatar">SA</div>
          </div>
        </header>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
            <section className="stats-grid">
              <Card variant="glass">
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">Registered Accounts</div>
              </Card>
              <Card variant="glass">
                <div className="stat-value">
                  {users.filter((u) => u.role === 'expert').length}
                </div>
                <div className="stat-label">Active Experts</div>
              </Card>
              <Card variant="glass">
                <div className="stat-value">
                  {verifications.filter((v) => v.status === 'PENDING_REVIEW').length}
                </div>
                <div className="stat-label">Pending Verifications</div>
              </Card>
            </section>

            {/* Users Table */}
            <section className="admin-table-section glass-panel">
              <div className="section-header">
                <h2>User Operations</h2>
                <Button variant="ghost" size="sm" onClick={() => alert('Exporting user records...')}>Export CSV</Button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge role--${user.role}`}>{user.role}</span></td>
                      <td><span className={`status-dot status--${user.status}`}>{user.status}</span></td>
                      <td>
                        <div className="action-buttons">
                          {user.status !== 'active' && (
                            <Button variant="secondary" size="sm" onClick={() => handleStatusChange(user.id, 'active')}>
                              Activate
                            </Button>
                          )}
                          {user.status !== 'suspended' && (
                            <Button variant="danger" size="sm" onClick={() => handleStatusChange(user.id, 'suspended')}>
                              Suspend
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : (
          /* Verification Queue Tab */
          <section className="admin-table-section glass-panel">
            <div className="section-header">
              <h2>Pending Expert Verifications ({verifications.length})</h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Category</th>
                  <th>Claimed Experience</th>
                  <th>Work Email OTP</th>
                  <th>Proof Document</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Admin Review Action</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <strong>{v.userName}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{v.userEmail}</div>
                    </td>
                    <td><span className="role-badge role--expert">{v.category}</span></td>
                    <td>{v.claimedOrg}</td>
                    <td>
                      {v.emailVerified ? (
                        <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Verified OTP</span>
                      ) : (
                        <span style={{ color: '#EF4444' }}>Unverified</span>
                      )}
                    </td>
                    <td>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert(`Viewing proof document: ${v.docName}`); }}>
                        📄 {v.docName}
                      </a>
                    </td>
                    <td>{v.submittedAt}</td>
                    <td>
                      <span className={`status-dot status--${v.status === 'APPROVED' ? 'active' : v.status === 'REJECTED' ? 'suspended' : 'pending'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      {v.status === 'PENDING_REVIEW' ? (
                        <div className="action-buttons" style={{ display: 'flex', gap: '6px' }}>
                          <Button variant="primary" size="sm" onClick={() => handleApproveVerification(v.id)}>
                            Approve Expert
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleRejectVerification(v.id)}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Audit Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={closeSettings} title="System Configuration">
        <div className="settings-modal-body">
          <Input
            label="System Maintenance Message"
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
          />
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={closeSettings}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              alert(`System message updated to: "${systemMessage}"`);
              closeSettings();
            }}>Save Configuration</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
