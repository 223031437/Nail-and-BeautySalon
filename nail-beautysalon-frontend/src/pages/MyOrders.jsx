import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import api from '../services/api';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/order/mine');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to load your orders.');
            }
        };
        fetchOrders();
    }, []);

    return (
        <Container className="py-5">
            <h2>My Orders</h2>
            <p className="text-muted mb-4">View your product orders and collection status.</p>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {orders.length === 0 && <Alert variant="info">You haven't placed any orders yet.</Alert>}

            {orders.map(order => (
                <Card key={order.orderId} className="mb-3 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="mb-0">{order.orderId}</h5>
                                <small className="text-muted">
                                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                                </small>
                            </div>
                            <span className={`badge ${order.status === 'Paid & Collected' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {order.status}
                            </span>
                        </div>
                        
                        <ul>
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.quantity} × {item.productName} — R{item.price.toFixed(2)}</li>
                            ))}
                        </ul>
                        <strong>Total: R{order.totalAmount.toFixed(2)}</strong>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}

export default MyOrders;