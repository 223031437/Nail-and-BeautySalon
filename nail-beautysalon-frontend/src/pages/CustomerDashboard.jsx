import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { appointmentsApi } from '../api/appointments'; 

function CustomerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await appointmentsApi.getMyAppointments();
                setAppointments(data);
            } catch (err) {
                setError('Failed to load your appointments.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-vh-100 bg-light p-4">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                    <div>
                        <h2>Welcome, {user?.username || 'Customer'}!</h2>
                        <p className="text-muted mb-0">Manage your appointments here.</p>
                    </div>
                    <Button variant="outline-danger" onClick={handleLogout}>
                        Log Out
                    </Button>
                </div>

                <Card className="shadow-sm border-0 mb-4">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">My Appointments</h4>
                            <Button variant="primary" as={Link} to="/appointment">
                                Book New Appointment
                            </Button>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        {loading ? (
                            <p>Loading your appointments...</p>
                        ) : appointments.length === 0 ? (
                            <Alert variant="info">
                                You have no upcoming appointments. <Link to="/appointment">Book one now!</Link>
                            </Alert>
                        ) : (
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Reference</th>
                                        <th>Date & Time</th>
                                        <th>Service</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((app) => (
                                        <tr key={app.appointmentId}>
                                            <td>{app.appointmentId}</td>
                                            <td>{new Date(app.dateTime).toLocaleString()}</td>
                                            <td>{app.serviceSelected}</td>
                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    {app.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default CustomerDashboard;