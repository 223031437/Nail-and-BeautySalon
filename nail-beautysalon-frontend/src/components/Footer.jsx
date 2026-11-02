import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="salon-footer">
            <Container>
                <Row className="gy-4">

                    <Col md={5}>
                        <h3 className="footer-brand">
                            NAIL & BEAUTY
                        </h3>

                        <p>
                            A place to relax, refresh and feel your best.
                        </p>
                    </Col>

                    <Col md={3}>
                        <h5>Explore</h5>

                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>

                            <li>
                                <Link to="/services">Services</Link>
                            </li>

                            <li>
                                <Link to="/products">Products</Link>
                            </li>

                            <li>
                                <Link to="/contact">Contact</Link>
                            </li>

                            <li>
                                <Link to="/about">About</Link>
                            </li>

                            <li>
                                <Link to="/login">Staff &amp; Admin Login</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h5>Visit Us</h5>

                        <p>
                            Cape Town, South Africa
                        </p>

                        <p>
                            Mon – Sat: 09:00 – 18:00
                        </p>
                    </Col>

                </Row>

                <div className="footer-bottom">
                    <p>
                        © 2026 Nail & Beauty Salon. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;