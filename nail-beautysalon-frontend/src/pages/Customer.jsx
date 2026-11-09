import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getCustomer, updateCustomer, deleteCustomer } from '../api/customerApi';
import MyBookings from '../components/MyBookings';
import MyOrders from './MyOrders';
import FieldError from '../components/FieldError';
import { hasErrors, required, validPhone } from '../utils';

const emptyForm = { userId: '', customerId: '', firstName: '', lastName: '', email: '', cellNumber: '' };

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'bookings', label: 'My Bookings' },
    { key: 'orders', label: 'My Orders' },
    { key: 'profile', label: 'My Profile' },
    { key: 'account', label: 'Account' },
];

function Customer() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) {
        return (
            <main className="customer-dashboard">
                <Container>
                    <p>You need to sign in to view the customer portal.</p>
                </Container>
            </main>
        );
    }

    return (
        <main className="customer-dashboard">
            <Container>

                <div className="dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">CUSTOMER PORTAL</p>
                        <h1>Welcome, {user?.name || user?.username}</h1>
                        <p>Manage your bookings and profile from your customer dashboard.</p>
                    </div>

                    <Button className="logout-button" onClick={logout}>
                        Logout
                    </Button>
                </div>

                <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="portal-nav mb-4">
                    {TABS.map((tab) => (
                        <Nav.Item key={tab.key}>
                            <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                {activeTab === 'overview' && <OverviewSection onNavigate={setActiveTab} />}
                {activeTab === 'bookings' && <MyBookings />}
                {activeTab === 'orders' && <MyOrders />}
                {activeTab === 'profile' && <ProfileSection userId={user.userId} />}
                {activeTab === 'account' && <AccountSection userId={user.userId} logout={logout} />}

            </Container>
        </main>
    );
}

function OverviewSection({ onNavigate }) {
    const cards = [
        { key: 'bookings', title: 'My Bookings', body: 'View, reschedule or cancel your appointments.', cta: 'View Bookings' },
        { key: 'orders', title: 'My Orders', body: 'View your product orders and collection status.', cta: 'View Orders' },
        { key: 'profile', title: 'My Profile', body: 'View and update your personal details.', cta: 'View Profile' },
        { key: 'account', title: 'Account', body: 'Manage your account settings.', cta: 'Account Settings' },
    ];

    return (
        <Row className="g-4">
            {cards.map((card) => (
                <Col md={4} key={card.key}>
                    <Card className="dashboard-card">
                        <Card.Body>
                            <h3>{card.title}</h3>
                            <p>{card.body}</p>
                            <Button className="dashboard-button" onClick={() => onNavigate(card.key)}>
                                {card.cta}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            <Col md={4}>
                <Card className="dashboard-card">
                    <Card.Body>
                        <h3>Book Now</h3>
                        <p>Choose a service and an available time slot.</p>
                        <Button as={Link} to="/appointment" className="dashboard-button">
                            Book Appointment
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

function ProfileSection({ userId }) {
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setError('No userId on this account yet.');
            return;
        }

        setLoading(true);
        getCustomer(userId)
            .then((data) => setForm({ ...emptyForm, ...data }))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [userId]);

    function handleChange(field) {
        return (event) => {
            setForm((f) => ({ ...f, [field]: event.target.value }));
            setFieldErrors((e) => ({ ...e, [field]: '' }));
        };
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const found = {
            firstName: required(form.firstName, 'First name'),
            lastName: required(form.lastName, 'Last name'),
            cellNumber: validPhone(form.cellNumber),
        };
        setFieldErrors(found);
        if (hasErrors(found)) {
            setError('Please fill in all the required fields marked below.');
            return;
        }

        updateCustomer(form)
            .then((updated) => {
                setForm({ ...emptyForm, ...updated });
                setEditing(false);
                setSuccess('Profile updated.');
            })
            .catch((err) => setError(err.message));
    };

    return (
        <section className="portal-section">
            <h2>My profile</h2>
            <p className="section-subtitle">View and update your personal details.</p>

            {error && <p className="status-msg error">{error}</p>}
            {success && <p className="status-msg success">{success}</p>}

            {loading ? (
                <p>Loading profile…</p>
            ) : (
                <Form onSubmit={handleSubmit} noValidate>

                    <Form.Group className="mb-3">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            value={form.firstName || ''}
                            onChange={handleChange('firstName')}
                            disabled={!editing}
                        />
                        <FieldError message={fieldErrors.firstName} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            value={form.lastName || ''}
                            onChange={handleChange('lastName')}
                            disabled={!editing}
                        />
                        <FieldError message={fieldErrors.lastName} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={form.email || ''}
                            disabled
                        />
                        <Form.Text muted>Your email is your login, so it cannot be changed here.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Cell number</Form.Label>
                        <Form.Control
                            type="text"
                            value={form.cellNumber || ''}
                            onChange={handleChange('cellNumber')}
                            disabled={!editing}
                        />
                        <FieldError message={fieldErrors.cellNumber} />
                    </Form.Group>

                    {editing ? (
                        <div className="d-flex gap-2">
                            <Button type="submit" className="dashboard-button">
                                Save changes
                            </Button>
                            <Button type="button" variant="outline-secondary" onClick={() => setEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button type="button" className="dashboard-button" onClick={() => setEditing(true)}>
                            Edit profile
                        </Button>
                    )}

                </Form>
            )}
        </section>
    );
}

function AccountSection({ userId, logout }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        getCustomer(userId)
            .then(setCustomer)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleDelete = () => {
        setError('');

        deleteCustomer(userId)
            .then(() => {
                logout();
            })
            .catch((err) => setError(err.message));
    };

    return (
        <section className="portal-section">
            <h2>Account settings</h2>
            <p className="section-subtitle">Manage the account behind your profile.</p>

            {error && <p className="status-msg error">{error}</p>}

            <div className="dashboard-card p-4 mb-4">
                <h3>Account details</h3>
                {loading ? (
                    <p>Loading account…</p>
                ) : (
                    <>
                        <p><strong>Customer ID:</strong> {customer?.customerId || '—'}</p>
                        <p><strong>Email:</strong> {customer?.email || '—'}</p>
                    </>
                )}
            </div>

            <div className="dashboard-card danger-zone p-4">
                <h3>Close account</h3>
                <p>This permanently deletes your customer record. This cannot be undone.</p>

                {!confirming ? (
                    <Button variant="outline-danger" onClick={() => setConfirming(true)}>
                        Delete my account
                    </Button>
                ) : (
                    <div className="d-flex gap-2">
                        <Button variant="danger" onClick={handleDelete}>
                            Yes, permanently delete
                        </Button>
                        <Button variant="outline-secondary" onClick={() => setConfirming(false)}>
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Customer;
