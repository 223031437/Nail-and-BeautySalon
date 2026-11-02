/*
 * author: Nandipha Galada
 * student number: 221225366
 * date: 13 August 2026
 * The Service Catalogue Page displays all beauty and wellness services offered by the nail and beauty salon.
 */

import { useState } from 'react';
import ServiceDetails from './ServiceDetails';

import eyebrowServicesImage from '../assets/eyebrow-services.jpeg';
import facialServicesImage from '../assets/facial-services.jpeg';
import massageServicesImage from '../assets/massage-services.jpeg';
import nailServicesImage from '../assets/nail-services.jpeg';
import waxingServicesImage from '../assets/waxing-services.png';

function ServiceCatalogue() {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            serviceId: 'S001',
            serviceName: 'Gel Manicure',
            category: 'Elegant Nails',
            description: 'A polished gel manicure designed for a clean, glossy and long-lasting finish.',
            price: 250,
            duration: '60 minutes',
            includes: [
                'Nail shaping and preparation',
                'Cuticle care',
                'Gel colour application',
                'Glossy top coat'
            ],
            aftercare: 'Avoid picking or peeling the gel. Use cuticle oil regularly and return for professional removal when needed.'
        },

        {
            serviceId: 'S002',
            serviceName: 'Luxury Pedicure',
            category: 'Elegant Nails',
            description: 'A relaxing pedicure experience combining nail care with a soothing foot treatment.',
            price: 350,
            duration: '75 minutes',
            includes: [
                'Foot soak',
                'Nail shaping',
                'Cuticle care',
                'Gentle exfoliation',
                'Moisturising treatment',
                'Polish or gel finish'
            ],
            aftercare: 'Keep feet moisturised and avoid very hot water immediately after the treatment.'
        },

        {
            serviceId: 'S003',
            serviceName: 'Acrylic Full Set',
            category: 'Elegant Nails',
            description: 'A durable acrylic nail set customised to your preferred shape and style.',
            price: 450,
            duration: '90 minutes',
            includes: [
                'Nail preparation',
                'Acrylic application',
                'Custom nail shaping',
                'Colour or polish finish'
            ],
            aftercare: 'Avoid using your nails as tools. Keep them clean and return for maintenance or professional removal.'
        },

        {
            serviceId: 'S004',
            serviceName: 'Signature Nail Art',
            category: 'Elegant Nails',
            description: 'Creative nail art designed to add a personalised and stylish finish to your manicure.',
            price: 300,
            duration: '75 minutes',
            includes: [
                'Nail preparation',
                'Base colour',
                'Custom nail art design',
                'Protective top coat'
            ],
            aftercare: 'Allow the nails to fully set and avoid harsh chemicals where possible to help preserve the design.'
        },

        {
            serviceId: 'S005',
            serviceName: 'Full Body Massage',
            category: 'Therapeutic Massage',
            description: 'A relaxing full-body massage designed to ease everyday tension and encourage relaxation.',
            price: 500,
            duration: '60 minutes',
            includes: [
                'Back and shoulder massage',
                'Arm and hand massage',
                'Leg massage',
                'Gentle relaxation techniques'
            ],
            aftercare: 'Drink water, rest when possible and avoid intense physical activity immediately after your treatment.'
        },

        {
            serviceId: 'S006',
            serviceName: 'Couples Massage',
            category: 'Therapeutic Massage',
            description: 'A shared relaxation experience designed for two people to unwind together.',
            price: 900,
            duration: '60 minutes',
            includes: [
                'Two-person massage session',
                'Back and shoulder massage',
                'Arm and leg massage',
                'Relaxation-focused techniques'
            ],
            aftercare: 'Stay hydrated, take time to relax after the treatment and avoid strenuous activity immediately afterwards.'
        },

        {
            serviceId: 'S007',
            serviceName: 'Hot Stone Massage',
            category: 'Therapeutic Massage',
            description: 'A calming massage experience using comfortably warmed stones alongside traditional massage techniques.',
            price: 650,
            duration: '75 minutes',
            includes: [
                'Relaxation massage',
                'Warm stone treatment',
                'Back and shoulder focus',
                'Gentle muscle relaxation'
            ],
            aftercare: 'Drink water and allow your body time to relax. Inform your therapist immediately if you experience discomfort during treatment.'
        },

        {
            serviceId: 'S008',
            serviceName: 'Back & Shoulder Massage',
            category: 'Therapeutic Massage',
            description: 'A focused treatment designed to target everyday tension around the back, neck and shoulders.',
            price: 300,
            duration: '30 minutes',
            includes: [
                'Back massage',
                'Shoulder massage',
                'Neck relaxation techniques',
                'Targeted tension relief'
            ],
            aftercare: 'Stay hydrated and avoid strenuous activity immediately after the session.'
        },

        {
            serviceId: 'S009',
            serviceName: 'Deep Cleansing Facial',
            category: 'Premium Facials',
            description: 'A refreshing facial designed to cleanse the skin and leave it looking fresh and renewed.',
            price: 400,
            duration: '60 minutes',
            includes: [
                'Gentle cleanse',
                'Exfoliation',
                'Steam treatment',
                'Face mask',
                'Moisturiser'
            ],
            aftercare: 'Keep the skin moisturised and use daily sunscreen. Avoid harsh exfoliation immediately after the treatment.'
        },

        {
            serviceId: 'S010',
            serviceName: 'Hydrating Glow Facial',
            category: 'Premium Facials',
            description: 'A nourishing facial focused on restoring moisture and giving the skin a soft, healthy glow.',
            price: 450,
            duration: '60 minutes',
            includes: [
                'Gentle cleanse',
                'Hydrating exfoliation',
                'Hydrating mask',
                'Moisturising treatment',
                'Glow-enhancing finishing products'
            ],
            aftercare: 'Keep the skin hydrated and use sunscreen during the day. Avoid introducing harsh new skincare products immediately after treatment.'
        },

        {
            serviceId: 'S011',
            serviceName: 'Anti-Aging Facial',
            category: 'Premium Facials',
            description: 'A luxurious facial focused on supporting smoother-looking, hydrated and refreshed skin.',
            price: 550,
            duration: '75 minutes',
            includes: [
                'Deep cleanse',
                'Gentle exfoliation',
                'Nourishing mask',
                'Facial massage',
                'Moisturising treatment'
            ],
            aftercare: 'Use gentle skincare and daily sunscreen. Follow the specific aftercare recommendations provided by your beauty therapist.'
        },

        {
            serviceId: 'S012',
            serviceName: 'Microneedling Renewal Facial',
            category: 'Premium Facials',
            description: 'A professional skin-renewal treatment designed to support a smoother and more refreshed appearance.',
            price: 750,
            duration: '75 minutes',
            includes: [
                'Skin preparation',
                'Professional microneedling treatment',
                'Soothing finishing treatment',
                'Post-treatment skincare guidance'
            ],
            aftercare: 'Follow the professional aftercare instructions provided after your treatment. Protect your skin from direct sun exposure and avoid harsh active skincare products until your skin has recovered.'
        },

        {
            serviceId: 'S013',
            serviceName: 'Classic Lashes',
            category: 'Lash & Brow',
            description: 'Natural-looking individual lash extensions designed to enhance the eyes with an elegant finish.',
            price: 350,
            duration: '90 minutes',
            includes: [
                'Eye area preparation',
                'Individual classic lash extensions',
                'Custom lash styling',
                'Final lash check'
            ],
            aftercare: 'Avoid rubbing the eyes and excessive moisture immediately after the treatment. Clean lashes gently using suitable lash-safe products.'
        },

        {
            serviceId: 'S014',
            serviceName: 'Lash Lift & Tint',
            category: 'Lash & Brow',
            description: 'A low-maintenance treatment that lifts and darkens the natural lashes for a brighter eye look.',
            price: 400,
            duration: '60 minutes',
            includes: [
                'Lash preparation',
                'Lash lift',
                'Lash tint',
                'Finishing treatment'
            ],
            aftercare: 'Avoid excessive moisture and steam immediately after the treatment and avoid rubbing the eye area.'
        },

        {
            serviceId: 'S015',
            serviceName: 'Brow Lamination',
            category: 'Lash & Brow',
            description: 'A brow styling treatment that creates a fuller, groomed and polished brow appearance.',
            price: 300,
            duration: '60 minutes',
            includes: [
                'Brow preparation',
                'Brow lamination',
                'Brow styling',
                'Conditioning treatment'
            ],
            aftercare: 'Avoid excessive moisture on the brows immediately after treatment and gently brush the brows into place as recommended by your therapist.'
        },

        {
            serviceId: 'S016',
            serviceName: 'Brow Shaping & Tint',
            category: 'Lash & Brow',
            description: 'A personalised brow treatment combining professional shaping with tinting for a defined finish.',
            price: 200,
            duration: '45 minutes',
            includes: [
                'Brow consultation',
                'Brow shaping',
                'Brow tint',
                'Finishing and styling'
            ],
            aftercare: 'Avoid rubbing the brow area and use gentle skincare around the brows immediately after treatment.'
        },

        {
            serviceId: 'S017',
            serviceName: 'Full Body Wax',
            category: 'Body Waxing',
            description: 'A complete waxing treatment for smooth, groomed skin across selected body areas.',
            price: 700,
            duration: '120 minutes',
            includes: [
                'Treatment consultation',
                'Waxing of selected body areas',
                'Professional skin preparation',
                'Soothing post-wax treatment'
            ],
            aftercare: 'Avoid hot baths, saunas, intense exercise and tight clothing immediately after waxing. Keep the skin clean and moisturised and avoid harsh exfoliation for a short period.'
        },

        {
            serviceId: 'S018',
            serviceName: 'Half Leg Wax',
            category: 'Body Waxing',
            description: 'Professional waxing from the knee down for smooth and neatly groomed legs.',
            price: 250,
            duration: '30 minutes',
            includes: [
                'Skin preparation',
                'Lower-leg waxing',
                'Soothing post-wax product'
            ],
            aftercare: 'Avoid heat, friction and intense exercise immediately after waxing. Keep the skin moisturised and avoid harsh exfoliation right away.'
        },

        {
            serviceId: 'S019',
            serviceName: 'Underarm Wax',
            category: 'Body Waxing',
            description: 'A quick and professional underarm waxing treatment for smooth, clean-looking skin.',
            price: 150,
            duration: '20 minutes',
            includes: [
                'Skin preparation',
                'Underarm waxing',
                'Soothing post-wax treatment'
            ],
            aftercare: 'Avoid deodorant, heavy sweating and friction immediately after treatment if the area feels sensitive.'
        },

        {
            serviceId: 'S020',
            serviceName: 'Bikini Wax',
            category: 'Body Waxing',
            description: 'A professional bikini-line waxing treatment for a clean and neatly groomed finish.',
            price: 250,
            duration: '30 minutes',
            includes: [
                'Treatment preparation',
                'Bikini-line waxing',
                'Soothing post-wax treatment'
            ],
            aftercare: 'Wear comfortable clothing and avoid heat, friction, swimming and intense exercise immediately after treatment. Keep the area clean and follow the therapist’s aftercare guidance.'
        }
    ];

    const categories = [
        ...new Set(services.map((service) => service.category))
    ];

    const categoryImages = {
        'Elegant Nails': nailServicesImage,
        'Therapeutic Massage': massageServicesImage,
        'Premium Facials': facialServicesImage,
        'Lash & Brow': eyebrowServicesImage,
        'Body Waxing': waxingServicesImage
    };

    if (selectedService) {
        return (
            <ServiceDetails
                service={selectedService}
                onBack={() => setSelectedService(null)}
            />
        );
    }

    return (
        <div className="services-catalogue">

            <section className="services-header">
                <p className="services-subtitle">
                    Beauty • Wellness • Self-Care
                </p>

                <h1>Our Services</h1>

                <p>
                    Discover our carefully selected beauty and wellness
                    treatments, created to help you look and feel your best.
                </p>
            </section>

            {categories.map((category) => (
                <section
                    className="service-category-section"
                    key={category}
                >

                    <h2>{category}</h2>

                    <img
                        src={categoryImages[category]}
                        alt={category}
                        className="service-category-image"
                    />

                    <div className="services-list">

                        {services
                            .filter(
                                (service) =>
                                    service.category === category
                            )
                            .map((service) => (

                                <div
                                    className="service-card"
                                    key={service.serviceId}
                                >

                                    <div className="service-info">

                                        <h3>
                                            {service.serviceName}
                                        </h3>

                                        <p>
                                            {service.description}
                                        </p>

                                    </div>

                                    <div className="service-action">

                                        <p className="service-price">
                                            R{service.price}
                                        </p>

                                        <button
                                            onClick={() =>
                                                setSelectedService(service)
                                            }
                                        >
                                            View Details
                                        </button>

                                    </div>

                                </div>
                            ))}

                    </div>

                </section>
            ))}

        </div>
    );
}

export default ServiceCatalogue;