/*
 * author: Nandipha Galada
 * student number: 221225366
 * date: 17 August 2026
 * The Service Details Page displays information about a selected salon service.
 */

import eyebrowServicesImage from '../assets/eyebrow-services.jpeg';
import facialServicesImage from '../assets/facial-services.jpeg';
import massageServicesImage from '../assets/massage-services.jpeg';
import nailServicesImage from '../assets/nail-services.jpeg';
import waxingServicesImage from '../assets/waxing-services.png';
import { useNavigate } from 'react-router-dom';

function ServiceDetails({ service, onBack }) {

        const navigate = useNavigate();
    if (!service) {
        return (
            <div className="service-details-not-found">
                <h1>Service Not Found</h1>

                <button onClick={onBack}>
                    Back to Services
                </button>
            </div>
        );
    }

    const categoryImages = {
        'Elegant Nails': nailServicesImage,
        'Therapeutic Massage': massageServicesImage,
        'Premium Facials': facialServicesImage,
        'Lash & Brow': eyebrowServicesImage,
        'Body Waxing': waxingServicesImage
    };

    const serviceImage = categoryImages[service.category];

    return (
        <div className="service-details">

            <div className="service-details-card">

                <img
                    src={serviceImage}
                    alt={service.category}
                    className="service-details-image"
                />

                <div className="service-details-content">

                    <p className="service-details-category">
                        {service.category}
                    </p>

                    <h1>
                        {service.serviceName}
                    </h1>

                    <div className="service-details-line"></div>

                    <p className="service-details-description">
                        {service.description}
                    </p>

                    <div className="service-details-info">

                        <div className="service-info-box">
                            <span>Duration</span>
                            <strong>{service.duration}</strong>
                        </div>

                        <div className="service-info-box">
                            <span>Price</span>
                            <strong>R{service.price}</strong>
                        </div>

                    </div>

                    <div className="service-details-section">

                        <h2>What's Included</h2>

                        <ul>
                            {service.includes.map((item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            ))}
                        </ul>

                    </div>

                    <div className="service-details-section aftercare-section">

                        <h2>Aftercare</h2>

                        <p>
                            {service.aftercare}
                        </p>

                    </div>

                    <div className="service-details-actions">

                        <button
                            className="book-service-button"
                            onClick={() =>
                                navigate('/appointment', {
                                    state: { service },
                                })
                            }
                        >
                            Book Appointment
                        </button>

                        <button
                            className="back-service-button"
                            onClick={onBack}
                        >
                            Back to Services
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ServiceDetails;