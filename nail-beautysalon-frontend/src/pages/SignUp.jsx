import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { authService } from '../services/authService';
import { getErrorMessage, getFieldErrors } from '../services/api';
import FieldError from '../components/FieldError';
import { hasErrors, required, validEmail, validPassword, validPhone } from '../utils';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', cellNumber: '', password: ''
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const found = {
            firstName: required(formData.firstName, 'First name'),
            lastName: required(formData.lastName, 'Last name'),
            email: validEmail(formData.email),
            cellNumber: validPhone(formData.cellNumber),
            password: validPassword(formData.password),
        };
        setErrors(found);
        if (hasErrors(found)) {
            setError('Please fill in all the required fields marked below.');
            return;
        }

        setLoading(true);

        try {
            await authService.registerCustomer({ ...formData, email: formData.email.trim() });
            navigate('/login', { state: { message: 'Account created! Please log in.' } });
        } catch (err) {
            setErrors(getFieldErrors(err));
            setError(getErrorMessage(err, 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <p className="auth-eyebrow">NAIL & BEAUTY</p>
                    <h1>Create an account</h1>
                    <p>Join us to book your next appointment.</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                    <div className="d-flex gap-3 mb-3">
                        <Form.Group className="w-50">
                            <Form.Control name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                            <FieldError message={errors.firstName} />
                        </Form.Group>
                        <Form.Group className="w-50">
                            <Form.Control name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                            <FieldError message={errors.lastName} />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Control type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} />
                        <FieldError message={errors.email} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control name="cellNumber" placeholder="Cell Number" value={formData.cellNumber} onChange={handleChange} />
                        <FieldError message={errors.cellNumber} />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Control type="password" name="password" placeholder="Password (min 8 characters)" value={formData.password} onChange={handleChange} />
                        <FieldError message={errors.password} />
                    </Form.Group>

                    <div className="auth-button-wrapper">
                        <Button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Creating...' : 'Sign Up'}
                        </Button>
                    </div>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default Signup;