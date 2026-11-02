import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import ServiceCatalogue from './pages/ServiceCatalogue.jsx';
import BookAppointment from './pages/Appointment';

// Auth Pages (No Navbar/Footer)
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboard Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import CustomerDashboard from './pages/CustomerDashboard'; 
import ServiceManagement from './pages/ServiceManagement.jsx';


const PublicLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavigationBar />
            <div className="flex-grow-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* AUTH ROUTES */}
                    

                    {/* DASHBOARD ROUTES */}
                    <Route path="/admin" element={<EmployeeDashboard />} />
                    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/service-management" element={<ServiceManagement />} />

                    {/* PUBLIC ROUTES  */}
                    <Route element={<PublicLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/services" element={<ServiceCatalogue />} />
                        <Route path="/appointment" element={<BookAppointment />} />
                    </Route>

                    {/* FALLBACK */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;