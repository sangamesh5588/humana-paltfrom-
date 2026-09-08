import { useState } from 'react';
import { Button, Card, Input, Modal } from '@human-platform/ui';
import { useBoolean } from '@human-platform/hooks';
import { formatDate } from '@human-platform/utils';
import { APP_NAME } from '@human-platform/constants';
import './App.css';

interface Booking {
  id: string;
  clientName: string;
  date: string;
  time: string;
  topic: string;
  status: 'confirmed' | 'pending';
}

export default function App() {
  const [isProfileOpen, { setTrue: openProfile, setFalse: closeProfile }] = useBoolean(false);
  const [earnings] = useState(12450);
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '101', clientName: 'Alice Johnson', date: '2026-07-18', time: '14:00', topic: 'AI Agent Architectures', status: 'confirmed' },
    { id: '102', clientName: 'Bob Vance', date: '2026-07-19', time: '10:00', topic: 'Monorepo Restructuring Review', status: 'confirmed' },
    { id: '103', clientName: 'Charlie Brown', date: '2026-07-20', time: '16:30', topic: 'Supabase Integration Query', status: 'pending' },
  ]);

  const [expertName, setExpertName] = useState('Dr. Evelyn Carter');
  const [expertTitle, setExpertTitle] = useState('Lead AI Solutions Architect');

  return (
    <div className="expert-layout">
      {/* Header */}
      <header className="expert-header glass-panel">
        <div className="logo">{APP_NAME} <span className="logo-badge">Expert</span></div>
        <div className="expert-user-profile" onClick={openProfile} style={{ cursor: 'pointer' }}>
          <span className="profile-role">{expertName}</span>
          <div className="avatar">EC</div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="expert-main">
        {/* Profile Card & Stats */}
        <section className="dashboard-top">
          <Card variant="glass" className="expert-profile-card">
            <div className="avatar avatar--large">EC</div>
            <h2>{expertName}</h2>
            <p className="expert-title-sub">{expertTitle}</p>
            <Button variant="ghost" size="sm" onClick={openProfile}>Edit Profile</Button>
          </Card>

          <div className="stats-column">
            <Card variant="glass" className="stat-card">
              <h3>Total Earnings</h3>
              <div className="stat-amount">${earnings.toLocaleString()}.00</div>
              <p className="stat-trend">+14% vs last month</p>
            </Card>
            <Card variant="glass" className="stat-card">
              <h3>Active Bookings</h3>
              <div className="stat-amount">{bookings.length}</div>
              <p className="stat-trend">{bookings.filter(b => b.status === 'confirmed').length} Confirmed</p>
            </Card>
          </div>
        </section>

        {/* Bookings Section */}
        <section className="bookings-section glass-panel">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Button variant="secondary" size="sm" onClick={() => alert('Opening scheduler settings...')}>Add Availability</Button>
          </div>

          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item glass-panel">
                <div className="booking-info">
                  <div className="booking-topic">{booking.topic}</div>
                  <div className="booking-client">Client: {booking.clientName}</div>
                  <div className="booking-time">
                    {formatDate(booking.date)} at {booking.time}
                  </div>
                </div>
                <div className="booking-actions">
                  <span className={`booking-status status--${booking.status}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'pending' && (
                    <Button variant="primary" size="sm" onClick={() => {
                      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'confirmed' } : b));
                    }}>
                      Approve
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => alert(`Starting video room for booking ${booking.id}...`)}>
                    Join Room
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={closeProfile} title="Edit Professional Profile">
        <div className="profile-edit-form">
          <Input
            label="Professional Display Name"
            value={expertName}
            onChange={(e) => setExpertName(e.target.value)}
          />
          <Input
            label="Expertise Title"
            value={expertTitle}
            onChange={(e) => setExpertTitle(e.target.value)}
          />
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={closeProfile}>Cancel</Button>
            <Button variant="primary" onClick={closeProfile}>Save Profile</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
