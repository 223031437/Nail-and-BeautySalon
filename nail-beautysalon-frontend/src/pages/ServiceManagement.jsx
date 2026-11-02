import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";


const ServiceManagement = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);

    const [service, setService] = useState({
        serviceId: "",
        serviceName: "",
        category: "",
        description: "",
        price: ""
    });

    const [editing, setEditing] = useState(false);

    const API_URL = "/service";

    const getAllServices = async () => {
        try {
            const response = await api.get(`${API_URL}/getAll`);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
            alert(getErrorMessage(error, "Could not load services."));
        }
    };

    useEffect(() => {
        getAllServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setService({
            ...service,
            [name]: value
        });
    };

    const createService = async (e) => {
        e.preventDefault();

        try {
            await api.post(`${API_URL}/create`, {
                ...service,
                price: parseFloat(service.price)
            });

            alert("Service created successfully!");

            clearForm();
            getAllServices();

        } catch (error) {
            console.error("Error creating service:", error);
            alert(getErrorMessage(error, "Could not create service."));
        }
    };

    const updateService = async (e) => {
        e.preventDefault();

        try {
            await api.put(`${API_URL}/update`, {
                ...service,
                price: parseFloat(service.price)
            });

            alert("Service updated successfully!");

            clearForm();
            getAllServices();

        } catch (error) {
            console.error("Error updating service:", error);
            alert(getErrorMessage(error, "Could not update service."));
        }
    };

    const deleteService = async (serviceId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`${API_URL}/delete/${encodeURIComponent(serviceId)}`);

            alert("Service deleted successfully!");

            getAllServices();

        } catch (error) {
            console.error("Error deleting service:", error);
            alert(getErrorMessage(error, "Could not delete service."));
        }
    };

    const editService = (selectedService) => {
        setService({
            serviceId: selectedService.serviceId,
            serviceName: selectedService.serviceName,
            category: selectedService.category,
            description: selectedService.description,
            price: selectedService.price
        });

        setEditing(true);
    };

    const clearForm = () => {
        setService({
            serviceId: "",
            serviceName: "",
            category: "",
            description: "",
            price: ""
        });

        setEditing(false);
    };

    return (
        <div className="service-management">

            <h1>Service Management</h1>

            <p><Link to={user?.role === "ROLE_ADMIN" ? "/admin" : "/employee/dashboard"}>← Back to dashboard</Link></p>

            <div className="service-form">

                <h2>
                    {editing ? "Update Service" : "Add New Service"}
                </h2>

                <form onSubmit={editing ? updateService : createService}>

                    <div>
                        <label>Service ID</label>

                        <input
                            type="text"
                            name="serviceId"
                            value={service.serviceId}
                            onChange={handleChange}
                            disabled={editing}
                            required
                        />
                    </div>

                    <div>
                        <label>Service Name</label>

                        <input
                            type="text"
                            name="serviceName"
                            value={service.serviceName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Category</label>

                        <input
                            type="text"
                            name="category"
                            value={service.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={service.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={service.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <button type="submit">
                        {editing ? "Update Service" : "Add Service"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}

                </form>
            </div>

            <div className="service-list">

                <h2>Available Services</h2>

                {services.length === 0 ? (
                    <p>No services available.</p>
                ) : (

                    <table>

                        <thead>
                        <tr>
                            <th>Service ID</th>
                            <th>Service Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {services.map((item) => (

                            <tr key={item.serviceId}>

                                <td>{item.serviceId}</td>

                                <td>{item.serviceName}</td>

                                <td>{item.category}</td>

                                <td>{item.description}</td>

                                <td>
                                    R{Number(item.price).toFixed(2)}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            editService(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteService(
                                                item.serviceId
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
};

export default ServiceManagement;