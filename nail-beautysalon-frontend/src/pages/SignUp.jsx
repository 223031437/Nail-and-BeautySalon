import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { authService } from '../services/authService';

function Signup() {
    const navigate = useNavigate();
    
    
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', cellNumber: '', password: ''
    });
    
   
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.registerCustomer(formData);
            
            navigate('/login', { state: { message: 'Account created! Please log in.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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

                <Form onSubmit={handleSubmit}>
                    <div className="d-flex gap-3 mb-3">
                        <Form.Group className="w-50">
                            <Form.Control 
                                name="firstName" 
                                placeholder="First Name" 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="w-50">
                            <Form.Control 
                                name="lastName" 
                                placeholder="Last Name" 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Control 
                            type="email" 
                            name="email" 
                            placeholder="Email address" 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control 
                            name="cellNumber" 
                            placeholder="Cell Number" 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Control 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                        />
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