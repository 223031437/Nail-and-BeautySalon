import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <section className="hero-section">
            <Container>
                <div className="hero-content">

                    <p className="hero-eyebrow">
                        NAILS • HAIR • BEAUTY
                    </p>

                    <h1>
                        Your beauty,
                        <br />
                        your moment.
                    </h1>

                    <p className="hero-description">
                        Discover a beauty experience designed around you.
                        From beautiful nails to professional hair and beauty
                        treatments, we're here to help you look and feel your best.
                    </p>

                    <div className="hero-buttons">
                        <Button
                            as={Link}
                            to="/appointment"
                            className="primary-button"
                        >
                            Book an Appointment
                        </Button>

                        <Button
                            as={Link}
                            to="/services"
                            className="secondary-button"
                        >
                            Explore Services
                        </Button>
                    </div>

                </div>
            </Container>
        </section>
    );
}

export default HeroSection;