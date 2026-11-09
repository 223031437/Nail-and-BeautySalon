import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import api from '../services/api';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
            try {
                const response = await api.get('/order/getAll');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to load orders. Are you logged in as an Admin?');
            }
        };

    useEffect(() => {
        
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/order/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refresh the list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <Container className="py-5">
            <h2>Manage Customer Orders</h2>
            <p className="text-muted mb-4">View products ordered by customers for in-store collection.</p>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>Order Ref</th>
                        <th>Customer Details</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Items Purchased</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId}>
                            <td><strong>{order.orderId}</strong></td>
                            <td>
                                {order.customerName}<br/>
                                <small>{order.customerEmail}</small><br/>
                                <small>{order.customerPhone}</small>
                            </td>
                            <td>R{order.totalAmount.toFixed(2)}</td>
                            <td>
                                <select 
                                    className="form-select form-select-sm"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.orderId, e.target.value)}
                                >
                                    <option value="Pending Collection">Pending Collection</option>
                                    <option value="Paid & Collected">Paid & Collected</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.quantity} × {item.productName}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default AdminOrders;