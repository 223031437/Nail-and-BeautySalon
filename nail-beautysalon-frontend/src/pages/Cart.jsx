import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import FieldError from '../components/FieldError';
import { hasErrors, required, validEmail, validPhone } from '../utils';

const formatPrice = (price) =>
    `R${Number(price).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const emptyCustomer = { name: '', email: '', phone: '', collection: 'Collect at salon' };

function Cart() {
    const { cart, cartTotal, changeQuantity, removeItem, clearCart } = useCart();
    const { user } = useAuth();
    const [showCheckout, setShowCheckout] = useState(false);
    const [customer, setCustomer] = useState(() => ({
        ...emptyCustomer,
        name: user?.role === 'ROLE_CUSTOMER' ? user.name || '' : '',
        email: user?.role === 'ROLE_CUSTOMER' ? user.username || '' : '',
    }));
    const [errors, setErrors] = useState({});
    const [order, setOrder] = useState(null);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const submitOrder = (e) => {
        e.preventDefault();
        const found = {
            name: required(customer.name, 'Full name'),
            email: validEmail(customer.email),
            phone: validPhone(customer.phone),
        };
        setErrors(found);
        if (hasErrors(found)) return;

        setOrder({
            number: `ORD-${Date.now().toString(36).toUpperCase()}`,
            customer,
            total: cartTotal,
        });
        clearCart();
        setShowCheckout(false);
    };

    if (order) {
        return (
            <section className="cart-page">
                <Container>
                    <div className="cart-panel order-confirmation" role="status">
                        <h2>Thank you, {order.customer.name}!</h2>
                        <p>Your order has been recorded.</p>
                        <p>Order reference: <strong>{order.number}</strong></p>
                        <p>Total: {formatPrice(order.total)}</p>
                        <p>Collection: {order.customer.collection}</p>
                        <p>No payment has been taken online. The salon will contact you to confirm and arrange payment.</p>
                        <Link to="/products" className="cart-button">Continue Shopping</Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <Container>
                <div className="products-header">
                    <p className="products-eyebrow">YOUR SELECTION</p>
                    <h1>Your Cart</h1>
                </div>

                {cart.length === 0 ? (
                    <div className="cart-panel cart-empty">
                        <p>Your cart is empty.</p>
                        <Link to="/products" className="cart-button">Browse Products</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-panel">
                            {cart.map((item) => (
                                <div className="cart-row" key={item.id}>
                                    <img src={item.image} alt={item.name} />
                                    <div className="cart-row__info">
                                        <h3>{item.name}</h3>
                                        <p>{item.brand} · {formatPrice(item.price)}</p>
                                        <div className="cart-qty">
                                            <button type="button" className="cart-qty-button" aria-label={`Decrease ${item.name}`} onClick={() => changeQuantity(item.id, -1)} disabled={item.quantity <= 1}>−</button>
                                            <span>{item.quantity}</span>
                                            <button type="button" className="cart-qty-button" aria-label={`Increase ${item.name}`} onClick={() => changeQuantity(item.id, 1)} disabled={item.quantity >= item.stock}>+</button>
                                            <button type="button" className="cart-remove" onClick={() => removeItem(item.id)}>Remove</button>
                                        </div>
                                    </div>
                                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                                </div>
                            ))}
                        </div>

                        <aside className="cart-panel cart-summary">
                            <h2>Order summary</h2>
                            <p className="cart-total">Total: {formatPrice(cartTotal)}</p>

                            {!showCheckout ? (
                                <>
                                    <button type="button" className="cart-button" onClick={() => setShowCheckout(true)}>Proceed to Checkout</button>
                                    <Link to="/products" className="cart-link">Continue shopping</Link>
                                </>
                            ) : (
                                <form onSubmit={submitOrder} noValidate className="cart-form">
                                    <label htmlFor="name">Full Name</label>
                                    <input id="name" name="name" value={customer.name} onChange={handleChange} />
                                    <FieldError message={errors.name} />

                                    <label htmlFor="email">Email Address</label>
                                    <input id="email" name="email" type="email" value={customer.email} onChange={handleChange} />
                                    <FieldError message={errors.email} />

                                    <label htmlFor="phone">Phone Number</label>
                                    <input id="phone" name="phone" type="tel" value={customer.phone} onChange={handleChange} />
                                    <FieldError message={errors.phone} />

                                    <label htmlFor="collection">Collection Option</label>
                                    <select id="collection" name="collection" value={customer.collection} onChange={handleChange}>
                                        <option>Collect at salon</option>
                                        <option>Arrange delivery with salon</option>
                                    </select>

                                    <button type="submit" className="cart-button">Place Order</button>
                                    <button type="button" className="cart-button cart-button--outline" onClick={() => setShowCheckout(false)}>Cancel</button>
                                </form>
                            )}
                        </aside>
                    </div>
                )}
            </Container>
        </section>
    );
}

export default Cart;
