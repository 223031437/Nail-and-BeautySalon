
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Product() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        collection: 'Collect at salon'
    });
    const [order, setOrder] = useState(null);

    const products = [
        {
            id: 1,
            name: 'Nail Strengthening Oil',
            brand: 'Nail Care Pro',
            category: 'Nail Care',
            description: 'Nourishing oil designed to strengthen and hydrate your nails.',
            price: 120,
            stock: 25,
            lowStockThreshold: 5,
            image: '/nail_strengthening_oil.png'
        },
        {
            id: 2,
            name: 'Cuticle Care Cream',
            brand: 'Beauty Essentials',
            category: 'Nail Care',
            description: 'A gentle cream that helps keep cuticles soft and moisturised.',
            price: 95,
            stock: 18,
            lowStockThreshold: 5,
            image: '/cuticle_care_cream.png'
        },
        {
            id: 3,
            name: 'Professional Hair Serum',
            brand: 'Salon Luxe',
            category: 'Hair Care',
            description: 'A lightweight serum for smooth, shiny and healthy-looking hair.',
            price: 180,
            stock: 3,
            lowStockThreshold: 5,
            image: '/professional_hair_serum.png'
        }
    ];

    const handleAddToCart = (product) => {
        const quantity =
            cart.find((item) => item.id === product.id)?.quantity || 0;

        if (quantity >= product.stock) {
            setMessage('Sorry, the available stock limit has been reached.');
            return;
        }

        setCart((current) => {
            const existing = current.find((item) => item.id === product.id);

            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...current, { ...product, quantity: 1 }];
        });

        setMessage(`${product.name} added to your cart.`);
        setOrder(null);
    };

    const changeQuantity = (id, amount) => {
        setCart((current) =>
            current
                .map((item) => {
                    if (item.id !== id) return item;
                    const next = item.quantity + amount;
                    if (next < 1 || next > item.stock) return item;
                    return { ...item, quantity: next };
                })
        );
    };

    const removeItem = (id) => {
        setCart((current) => current.filter((item) => item.id !== id));
        setMessage('Item removed from cart.');
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase());

        return (
            matchesSearch &&
            (selectedCategory === 'all' ||
                product.category === selectedCategory)
        );
    });

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const formatPrice = (price) =>
        `R${price.toLocaleString('en-ZA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    const submitOrder = (event) => {
        event.preventDefault();

        if (!customer.name.trim() || !customer.email.trim() ||
            !customer.phone.trim()) {
            setMessage('Please complete all customer details.');
            return;
        }

        setOrder({
            number: `SAL-${Date.now().toString().slice(-6)}`,
            customer: { ...customer },
            items: cart.map((item) => ({ ...item })),
            total: cartTotal
        });

        setCart([]);
        setShowCheckout(false);
        setMessage('');
    };

    return (
        <section className="product-page">
            <Container>
                <div className="products-header">
                    <p className="products-eyebrow">BEAUTY • CARE • QUALITY</p>
                    <h1>Our Products</h1>
                    <p className="products-description">
                        Browse our collection of beauty essentials, from nail
                        care to hair care, all available at the salon.
                    </p>
                </div>

                <div className="product-filters">
                    <input
                        type="text"
                        className="product-search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="Nail Care">Nail Care</option>
                        <option value="Hair Care">Hair Care</option>
                    </select>
                </div>

                {message && <p role="status" className="cart-message">{message}</p>}

                <Row className="product-grid">
                    {filteredProducts.length ? (
                        filteredProducts.map((product) => {
                            const quantity =
                                cart.find((item) => item.id === product.id)
                                    ?.quantity || 0;

                            const lowStock =
                                product.stock <= product.lowStockThreshold;

                            return (
                                <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
                                    <Card className="product-card">
                                        <div className="product-image">
                                            <img src={product.image} alt={product.name} />
                                        </div>

                                        <Card.Body>
                                            <p className="product-brand">{product.brand}</p>
                                            <h3 className="product-name">{product.name}</h3>
                                            <p className="product-category">{product.category}</p>
                                            <p className="product-description">{product.description}</p>

                                            <div className="product-bottom">
                                                <strong className="product-price">
                                                    {formatPrice(product.price)}
                                                </strong>
                                                <div className="stock-row">
                                                    <span className={
                                                        product.stock === 0
                                                            ? 'low-stock'
                                                            : lowStock
                                                                ? 'low-stock'
                                                                : 'in-stock'
                                                    }>
                                                        {product.stock === 0
                                                            ? 'Out of Stock'
                                                            : lowStock
                                                                ? `Low Stock (${product.stock})`
                                                                : 'In Stock'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="add-cart-button"
                                                disabled={product.stock === 0 || quantity >= product.stock}
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                {product.stock === 0
                                                    ? 'Out of Stock'
                                                    : quantity >= product.stock
                                                        ? 'Stock Limit Reached'
                                                        : 'Add to Cart'}
                                            </button>

                                            <button
                                                type="button"
                                                className="view-details-button"
                                                onClick={() => setSelectedProduct(product)}
                                            >
                                                View Details
                                            </button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <Col><p className="no-products">No products found.</p></Col>
                    )}
                </Row>

                <section className="cart-summary">
                    <h2>Your Shopping Cart ({cartCount})</h2>

                    {cart.length === 0 ? (
                        <p>Your cart is empty. Add a product to get started.</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <span>{item.name} — {formatPrice(item.price)}</span>
                                    <div className="cart-quantity">
                                        <button type="button" onClick={() => changeQuantity(item.id, -1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            disabled={item.quantity >= item.stock}
                                            onClick={() => changeQuantity(item.id, 1)}
                                        >+</button>
                                        <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                                    </div>
                                </div>
                            ))}

                            <h3>Total: {formatPrice(cartTotal)}</h3>
                            <button
                                type="button"
                                className="checkout-button"
                                onClick={() => setShowCheckout(true)}
                            >
                                Proceed to Checkout
                            </button>
                        </>
                    )}
                </section>

                {showCheckout && (
                    <section className="checkout-panel">
                        <h2>Checkout</h2>
                        <p>Enter your details to place your order.</p>

                        <form onSubmit={submitOrder}>
                            <label>
                                Full Name
                                <input
                                    required
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                />
                            </label>

                            <label>
                                Email Address
                                <input
                                    required
                                    type="email"
                                    value={customer.email}
                                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                />
                            </label>

                            <label>
                                Phone Number
                                <input
                                    required
                                    type="tel"
                                    value={customer.phone}
                                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                />
                            </label>

                            <label>
                                Collection Option
                                <select
                                    value={customer.collection}
                                    onChange={(e) => setCustomer({ ...customer, collection: e.target.value })}
                                >
                                    <option>Collect at salon</option>
                                    <option>Arrange delivery with salon</option>
                                </select>
                            </label>

                            <h3>Order total: {formatPrice(cartTotal)}</h3>

                            <button type="submit" className="checkout-button">
                                Place Order
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowCheckout(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </section>
                )}

                {order && (
                    <section className="order-confirmation" role="status">
                        <h2>Thank you, {order.customer.name}!</h2>
                        <p>Your demo order has been recorded on this page.</p>
                        <p>Order reference: <strong>{order.number}</strong></p>
                        <p>Total: {formatPrice(order.total)}</p>
                        <p>Collection: {order.customer.collection}</p>
                        <p>No payment has been taken. Contact the salon to confirm fulfilment.</p>
                        <button type="button" onClick={() => setOrder(null)}>
                            Continue Shopping
                        </button>
                    </section>
                )}

                {selectedProduct && (
                    <div
                        className="product-details-overlay"
                        onClick={() => setSelectedProduct(null)}
                    >
                        <div
                            className="product-details-modal"
                            role="dialog"
                            aria-modal="true"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                aria-label="Close details"
                            >×</button>

                            <img src={selectedProduct.image} alt={selectedProduct.name} />
                            <p>{selectedProduct.brand}</p>
                            <h2>{selectedProduct.name}</h2>
                            <p>{selectedProduct.description}</p>
                            <p>{selectedProduct.category}</p>
                            <h3>{formatPrice(selectedProduct.price)}</h3>
                            <p>{selectedProduct.stock} in stock</p>

                            <button
                                type="button"
                                className="add-cart-button"
                                disabled={
                                    selectedProduct.stock === 0 ||
                                    (cart.find((item) => item.id === selectedProduct.id)?.quantity || 0) >= selectedProduct.stock
                                }
                                onClick={() => handleAddToCart(selectedProduct)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                )}
            </Container>
        </section>
    );
}

export default Product;
