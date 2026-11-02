

import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import api from '../services/api';

function Product() {
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

    // Fetch products from the database
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

    // Save wishlist in local storage
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Get categories from database products
    const categories = [
        'All',
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ];

    // Add or remove a product from wishlist
    const toggleWishlist = (product) => {
        const productID = product.productID;

        setWishlist(previous => {
            const alreadySaved = previous.some(
                item => item.productID === productID
            );

            if (alreadySaved) {
                return previous.filter(
                    item => item.productID !== productID
                );
            }

            return [...previous, product];
        });
    };

    const isWishlisted = (productID) => {
        return wishlist.some(item => item.productID === productID);
    };

    // Search and category filtering
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(price || 0);
    };

    // Get product image from the public/images folder
    const getProductImage = (product) => {
        return product.imageUrl
            ? `/${product.imageUrl.replace(/^\/+/, '')}`
            : null;
    };

    return (
        <Container className="py-5">
            <div className="text-center mb-4">
                <h2>Our Products</h2>
                <p>
                    Explore our salon products and save your favourites
                    to your wishlist.
                </p>
            </div>

            {/* Search and category filters */}
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
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Wishlist count */}
            <div className="mb-3 text-end">
                <strong>♡ Wishlist: {wishlist.length}</strong>
            </div>

            {/* Loading state */}
            {loading && (
                <p className="text-center">Loading products...</p>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}

            {/* Empty database state */}
            {!loading && !error && products.length === 0 && (
                <div className="text-center py-5">
                    <h5>No products available yet.</h5>
                    <p>Products added to the database will appear here.</p>
                </div>
            )}

            {/* No search results */}
            {!loading && !error && products.length > 0 &&
                filteredProducts.length === 0 && (
                    <p className="text-center">
                        No products match your search.
                    </p>
                )}

            {/* Product catalogue */}
            <Row className="g-4">
                {filteredProducts.map(product => (
                    <Col md={4} sm={6} key={product.productID}>
                        <Card className="h-100 shadow-sm">

                            {/* Product image */}
                            {getProductImage(product) && (
                                <Card.Img
                                    variant="top"
                                    src={getProductImage(product)}
                                    alt={product.productName}
                                    style={{
                                        height: '230px',
                                        objectFit: 'contain',
                                        padding: '12px',
                                        backgroundColor: '#fff'
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}

                            <Card.Body className="d-flex flex-column">
                                <Card.Title>
                                    {product.productName}
                                </Card.Title>

                                <Card.Subtitle className="mb-2 text-muted">
                                    {product.category}
                                </Card.Subtitle>

                                <Card.Text>
                                    {product.description}
                                </Card.Text>

                                <h5 className="mb-2">
                                    {formatPrice(product.price)}
                                </h5>

                                <p className="small text-muted mb-2">
                                    Supplier: {product.supplier || 'Not specified'}
                                </p>

                                <p className="small mb-3">
                                    Stock: {product.quantityInStock}
                                    {product.unitOfMeasure
                                        ? ` ${product.unitOfMeasure}`
                                        : ''}
                                </p>

                                {product.quantityInStock <= product.lowStockThreshold && (
                                    <p className="text-danger small">
                                        Low stock
                                    </p>
                                )}

                                <div className="mt-auto d-grid gap-2">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        View Details
                                    </Button>

                                    <Button
                                        variant={
                                            isWishlisted(product.productID)
                                                ? 'danger'
                                                : 'outline-danger'
                                        }
                                        onClick={() => toggleWishlist(product)}
                                    >
                                        {isWishlisted(product.productID)
                                            ? '♥ Remove from Wishlist'
                                            : '♡ Add to Wishlist'}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Product details modal */}
            <Modal
                show={selectedProduct !== null}
                onHide={() => setSelectedProduct(null)}
                centered
            >
                {selectedProduct && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {selectedProduct.productName}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {getProductImage(selectedProduct) && (
                                <img
                                    src={getProductImage(selectedProduct)}
                                    alt={selectedProduct.productName}
                                    className="img-fluid rounded mb-3"
                                    style={{
                                        width: '100%',
                                        height: '220px',
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}

                            <p>
                                <strong>Category:</strong>{' '}
                                {selectedProduct.category}
                            </p>

                            <p>
                                <strong>Description:</strong>{' '}
                                {selectedProduct.description || 'No description available.'}
                            </p>

                            <p>
                                <strong>Price:</strong>{' '}
                                {formatPrice(selectedProduct.price)}
                            </p>

                            <p>
                                <strong>Supplier:</strong>{' '}
                                {selectedProduct.supplier || 'Not specified'}
                            </p>

                            <p>
                                <strong>Available Stock:</strong>{' '}
                                {selectedProduct.quantityInStock}
                            </p>

                            <p>
                                <strong>Unit:</strong>{' '}
                                {selectedProduct.unitOfMeasure || 'Not specified'}
                            </p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Close
                            </Button>

                            <Button
                                variant={
                                    isWishlisted(selectedProduct.productID)
                                        ? 'danger'
                                        : 'outline-danger'
                                }
                                onClick={() => toggleWishlist(selectedProduct)}
                            >
                                {isWishlisted(selectedProduct.productID)
                                    ? '♥ Remove from Wishlist'
                                    : '♡ Add to Wishlist'}
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
}

export default Product;

