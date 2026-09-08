import React, { useState } from 'react';
import { Button, Card, Input, Modal } from '@human-platform/ui';
import { useBoolean } from '@human-platform/hooks';
import { APP_NAME } from '@human-platform/constants';
import './App.css';

interface Employee {
  id: string;
  name: string;
  department: string;
  status: 'active' | 'onboarding';
}

export default function App() {
  const [isHiringOpen, { setTrue: openHiring, setFalse: closeHiring }] = useBoolean(false);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'e1', name: 'Dwight Schrute', department: 'Sales', status: 'active' },
    { id: 'e2', name: 'Jim Halpert', department: 'Sales', status: 'active' },
    { id: 'e3', name: 'Pam Beesly', department: 'Administration', status: 'active' },
    { id: 'e4', name: 'Ryan Howard', department: 'Logistics', status: 'onboarding' },
  ]);

  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeDept, setNewEmployeeDept] = useState('');

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName || !newEmployeeDept) return;

    const newEmp: Employee = {
      id: `e${Date.now()}`,
      name: newEmployeeName,
      department: newEmployeeDept,
      status: 'onboarding',
    };

    setEmployees((prev) => [...prev, newEmp]);
    setNewEmployeeName('');
    setNewEmployeeDept('');
    closeHiring();
  };

  return (
    <div className="org-layout">
      {/* Sidebar */}
      <aside className="org-sidebar glass-panel">
        <div className="logo">{APP_NAME} <span className="logo-badge">Org</span></div>
        <div className="company-info-box">
          <div className="company-logo">DM</div>
          <div>
            <h4 className="company-name">Dunder Mifflin</h4>
            <p className="company-plan">Enterprise Plan</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Organization Roster</a>
          <a href="#" className="nav-item">Active Contracts</a>
          <a href="#" className="nav-item">Billing & Invoices</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="org-main">
        <header className="org-header glass-panel">
          <h1 className="org-page-title">Corporate Portal</h1>
          <Button variant="primary" size="sm" onClick={openHiring}>
            + Add Employee
          </Button>
        </header>

        {/* Info Grid */}
        <section className="info-grid">
          <Card variant="glass">
            <div className="info-value">{employees.length}</div>
            <div className="info-label">Enrolled Employees</div>
          </Card>
          <Card variant="glass">
            <div className="info-value">
              {employees.filter((e) => e.status === 'active').length}
            </div>
            <div className="info-label">Active Members</div>
          </Card>
          <Card variant="glass">
            <div className="info-value">$24,900 / mo</div>
            <div className="info-label">Current Spend Limit</div>
          </Card>
        </section>

        {/* Team Table */}
        <section className="org-table-section glass-panel">
          <h2>Department Roster</h2>
          <table className="org-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td><strong>{emp.name}</strong></td>
                  <td>{emp.department}</td>
                  <td>
                    <span className={`status-badge status--${emp.status}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => alert(`Opening logs for ${emp.name}...`)}>
                      View Audits
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Hire Modal */}
      <Modal isOpen={isHiringOpen} onClose={closeHiring} title="Onboard New Employee">
        <form onSubmit={handleHireSubmit} className="hire-form">
          <Input
            label="Full Name"
            placeholder="Johnathan Doe"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
          />
          <Input
            label="Corporate Department"
            placeholder="e.g. Sales, Marketing, Tech"
            value={newEmployeeDept}
            onChange={(e) => setNewEmployeeDept(e.target.value)}
          />
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={closeHiring}>Cancel</Button>
            <Button variant="primary" type="submit">Complete Setup</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
