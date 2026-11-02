import { useState } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { useAuth } from '../context/AuthContext';
import BookingsPanel from '../components/staff/BookingsPanel';
import PaymentsPanel from '../components/staff/PaymentsPanel';
import MessagesPanel from '../components/staff/MessagesPanel';
import EmployeesPanel from '../components/staff/EmployeesPanel';
import CustomersPanel from '../components/staff/CustomersPanel';

/**
 * Staff portal. The same page is used for the admin (/admin) and employees (/employee/dashboard);
 * the admin additionally gets the Employees tab and can change payment statuses.
 */
function EmployeeDashboard({ admin = false }) {
    const { user, logout } = useAuth();
    const isAdmin = admin || user?.role === 'ROLE_ADMIN';
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'bookings', label: 'Bookings' },
        { key: 'payments', label: 'Payments' },
        { key: 'messages', label: 'Messages' },
        { key: 'customers', label: 'Customers' },
        ...(isAdmin ? [{ key: 'employees', label: 'Employees' }] : []),
    ];

    const cards = [
        { key: 'bookings', title: 'Bookings', body: 'View every booking, change a time slot or cancel.', cta: 'View Bookings' },
        { key: 'payments', title: 'Payments', body: 'See what has been paid and what is still pending.', cta: 'View Payments' },
        { key: 'messages', title: 'Messages', body: 'Answer messages from the Contact page by email or phone.', cta: 'View Messages' },
        { key: 'customers', title: 'Customers', body: 'Look up registered customers.', cta: 'View Customers' },
        ...(isAdmin ? [{ key: 'employees', title: 'Employees', body: 'Register new employees and manage the team.', cta: 'Manage Employees' }] : []),
    ];

    return (
        <main className="employee-dashboard">
            <Container>
                <div className="dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">{isAdmin ? 'ADMIN PORTAL' : 'EMPLOYEE PORTAL'}</p>

                        <h1>Welcome, {user?.name || user?.username}</h1>

                        <p>Manage your salon activities from your {isAdmin ? 'admin' : 'employee'} dashboard.</p>
                    </div>

                    <Button className="logout-button" onClick={logout}>
                        Logout
                    </Button>
                </div>

                <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="portal-nav mb-4">
                    {tabs.map((tab) => (
                        <Nav.Item key={tab.key}>
                            <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                {activeTab === 'overview' && (
                    <Row className="g-4">
                        {cards.map((card) => (
                            <Col md={6} lg={4} key={card.key}>
                                <Card className="dashboard-card">
                                    <Card.Body>
                                        <h3>{card.title}</h3>
                                        <p>{card.body}</p>
                                        <Button className="dashboard-button" onClick={() => setActiveTab(card.key)}>
                                            {card.cta}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        <Col md={6} lg={4}>
                            <Card className="dashboard-card">
                                <Card.Body>
                                    <h3>Services</h3>
                                    <p>Add, edit or remove the services customers can book.</p>
                                    <Button as={Link} to="/service-management" className="dashboard-button">
                                        Manage Services
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {activeTab === 'bookings' && <BookingsPanel />}
                {activeTab === 'payments' && <PaymentsPanel isAdmin={isAdmin} />}
                {activeTab === 'messages' && <MessagesPanel isAdmin={isAdmin} />}
                {activeTab === 'customers' && <CustomersPanel />}
                {activeTab === 'employees' && isAdmin && <EmployeesPanel />}
            </Container>
        </main>
    );
}

export default EmployeeDashboard;
