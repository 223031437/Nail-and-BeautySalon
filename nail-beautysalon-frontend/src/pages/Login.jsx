import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import FieldError from '../components/FieldError';
import { homePathFor } from '../components/ProtectedRoute';
import { validEmail } from '../utils';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const notice = location.state?.message;
    const [errors, setErrors] = useState({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const found = {
            email: validEmail(email),
            password: password ? '' : 'Password is required',
        };
        setErrors(found);
        if (found.email || found.password) {
            setError('Please enter your email and password.');
            return;
        }

        setLoading(true);

        try {
            const userData = await login(email, password);
            navigate(homePathFor(userData.role));
        } catch (err) {
            setError(getErrorMessage(err, 'Invalid email or password'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <p className="auth-eyebrow">NAIL & BEAUTY</p>
                    <h1>Welcome back</h1>
                    <p>Sign in to access your account.</p>
                </div>

                {notice && <Alert variant="success">{notice}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                        <FieldError message={errors.email} />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                        <FieldError message={errors.password} />
                    </Form.Group>

                    <div className="auth-button-wrapper">
                        <Button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </div>

                    <p className="auth-footer">
                        New customer? <Link to="/signup">Create an account</Link>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default Login;