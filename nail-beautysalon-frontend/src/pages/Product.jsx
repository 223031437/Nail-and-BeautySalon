import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Product() {
    const { quantityOf, addToCart, cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [message, setMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

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
        },
        { id: 4, name: 'Gel Top Coat', brand: 'Nail Care Pro', category: 'Nail Care', description: 'High-shine, chip-resistant top coat that seals and protects gel colour.', price: 110, stock: 30, lowStockThreshold: 5, image: '/products/gel_top_coat.svg' },
        { id: 5, name: 'Gentle Polish Remover', brand: 'Beauty Essentials', category: 'Nail Care', description: 'Acetone-free remover enriched with vitamin E to keep nails and skin soft.', price: 65, stock: 40, lowStockThreshold: 8, image: '/products/polish_remover.svg' },
        { id: 6, name: 'Hand & Nail Cream', brand: 'Salon Luxe', category: 'Nail Care', description: 'Rich daily hand cream that nourishes dry hands and strengthens nails.', price: 85, stock: 22, lowStockThreshold: 5, image: '/products/hand_nail_cream.svg' },
        { id: 7, name: 'Repair Base Coat', brand: 'Nail Care Pro', category: 'Nail Care', description: 'Strengthening base coat that protects weak, brittle nails before colour.', price: 105, stock: 4, lowStockThreshold: 5, image: '/products/nail_base_coat.svg' },
        { id: 8, name: 'Argan Hair Oil', brand: 'Salon Luxe', category: 'Hair Care', description: 'Pure argan oil that tames frizz and adds a natural shine.', price: 195, stock: 15, lowStockThreshold: 5, image: '/products/argan_hair_oil.svg' },
        { id: 9, name: 'Keratin Shampoo', brand: 'Beauty Essentials', category: 'Hair Care', description: 'Sulphate-free shampoo that cleanses gently and smooths damaged hair.', price: 150, stock: 20, lowStockThreshold: 5, image: '/products/keratin_shampoo.svg' },
        { id: 10, name: 'Deep Conditioning Hair Mask', brand: 'Salon Luxe', category: 'Hair Care', description: 'Intensive weekly mask that restores moisture and softness.', price: 210, stock: 12, lowStockThreshold: 5, image: '/products/hair_mask.svg' },
        { id: 11, name: 'Hydrating Facial Serum', brand: 'Pure Glow', category: 'Skin Care', description: 'Lightweight hyaluronic serum for plump, hydrated, glowing skin.', price: 260, stock: 10, lowStockThreshold: 5, image: '/products/facial_serum.svg' },
        { id: 12, name: 'Gentle Facial Cleanser', brand: 'Pure Glow', category: 'Skin Care', description: 'Soap-free daily cleanser that removes make-up without drying the skin.', price: 140, stock: 26, lowStockThreshold: 5, image: '/products/facial_cleanser.svg' },
        { id: 13, name: 'Rose Body Butter', brand: 'Pure Glow', category: 'Skin Care', description: 'Whipped shea and rose body butter for soft, deeply moisturised skin.', price: 175, stock: 0, lowStockThreshold: 5, image: '/products/rose_body_butter.svg' }
    ];

    const handleAddToCart = (product) => {
        if (addToCart(product)) {
            setMessage(`${product.name} added to your cart.`);
        } else {
            setMessage('Sorry, the available stock limit has been reached.');
        }
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

    const formatPrice = (price) =>
        `R${price.toLocaleString('en-ZA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

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
                        <option value="Skin Care">Skin Care</option>
                    </select>
                </div>

                {message && (
                    <p role="status" className="cart-message">
                        {message}{' '}
                        {cartCount > 0 && <Link to="/cart">View cart ({cartCount})</Link>}
                    </p>
                )}

                <Row className="product-grid">
                    {filteredProducts.length ? (
                        filteredProducts.map((product) => {
                            const quantity = quantityOf(product.id);

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
                                    quantityOf(selectedProduct.id) >= selectedProduct.stock
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