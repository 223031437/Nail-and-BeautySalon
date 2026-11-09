import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect to cart
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useCart } from '../context/CartContext'; // Import Cart
import api from '../services/api';

function Product() {
    const navigate = useNavigate();
    const { addToCart } = useCart(); // Use Cart Hook

    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || [];
        } catch {
            return [];
        }
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await api.get('/product/getAll');
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Unable to load products. Please log in and try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const categories = ['All', ...new Set(products.map(product => product.category).filter(Boolean))];

    const toggleWishlist = (product) => {
        const productID = product.productID;
        setWishlist(previous => {
            const alreadySaved = previous.some(item => item.productID === productID);
            if (alreadySaved) {
                return previous.filter(item => item.productID !== productID);
            }
            return [...previous, product];
        });
    };

    const isWishlisted = (productID) => wishlist.some(item => item.productID === productID);

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(price || 0);
    };

    const getProductImage = (product) => {
        return product.imageUrl ? `/${product.imageUrl.replace(/^\/+/, '')}` : null;
    };

    const handleAddToCart = (product) => {
        const success = addToCart(product);
        if (success) {
            alert(`${product.productName} added to cart!`);
        } else {
            alert('Cannot add more of this item. Stock limit reached.');
        }
    };

    return (
        <Container className="py-5">
            <div className="text-center mb-4">
                <h2>Our Products</h2>
                <p>Explore our salon products and save your favourites to your wishlist.</p>
            </div>

            <Row className="mb-4 g-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <div className="mb-3 text-end">
                <strong>♡ Wishlist: {wishlist.length}</strong>
            </div>

            {loading && <p className="text-center">Loading products...</p>}
            {!loading && error && <div className="alert alert-danger text-center">{error}</div>}
            {!loading && !error && products.length === 0 && (
                <div className="text-center py-5">
                    <h5>No products available yet.</h5>
                </div>
            )}
            {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
                <p className="text-center">No products match your search.</p>
            )}

            <Row className="g-4">
                {filteredProducts.map(product => (
                    <Col md={4} sm={6} key={product.productID}>
                        <Card className="h-100 shadow-sm position-relative">
                            {/* HEART ICON (Top Right) */}
                            <Button
                                variant={isWishlisted(product.productID) ? 'danger' : 'light'}
                                className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                                style={{ zIndex: 10, width: '40px', height: '40px', padding: 0 }}
                                onClick={() => toggleWishlist(product)}
                            >
                                {isWishlisted(product.productID) ? '♥' : '♡'}
                            </Button>

                            {getProductImage(product) && (
                                <Card.Img
                                    variant="top"
                                    src={getProductImage(product)}
                                    alt={product.productName}
                                    style={{ height: '230px', objectFit: 'contain', padding: '12px', backgroundColor: '#fff' }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            )}

                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{product.productName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
                                <Card.Text>{product.description}</Card.Text>
                                <h5 className="mb-2">{formatPrice(product.price)}</h5>
                                <p className="small text-muted mb-2">Supplier: {product.supplier || 'Not specified'}</p>
                                <p className="small mb-3">Stock: {product.quantityInStock}</p>

                                <div className="mt-auto d-grid gap-2">
                                    <Button variant="outline-secondary" onClick={() => setSelectedProduct(product)}>
                                        View Details
                                    </Button>
                                    {/* ADD TO CART BUTTON */}
                                    <Button variant="primary" onClick={() => handleAddToCart(product)}>
                                        Add to Cart
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Product details modal */}
            <Modal show={selectedProduct !== null} onHide={() => setSelectedProduct(null)} centered>
                {selectedProduct && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedProduct.productName}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {getProductImage(selectedProduct) && (
                                <img src={getProductImage(selectedProduct)} alt={selectedProduct.productName} className="img-fluid rounded mb-3" style={{ width: '100%', height: '220px', objectFit: 'contain' }} />
                            )}
                            <p><strong>Category:</strong> {selectedProduct.category}</p>
                            <p><strong>Description:</strong> {selectedProduct.description}</p>
                            <p><strong>Price:</strong> {formatPrice(selectedProduct.price)}</p>
                            <p><strong>Stock:</strong> {selectedProduct.quantityInStock}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setSelectedProduct(null)}>Close</Button>
                            <Button variant="primary" onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
}

export default Product;