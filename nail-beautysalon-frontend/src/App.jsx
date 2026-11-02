import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookAppointment from './pages/Appointment';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Customer from './pages/Customer';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import ServiceCatalogue from './pages/ServiceCatalogue.jsx';
import ServiceManagement from './pages/ServiceManagement.jsx';

const STAFF = ['ROLE_ADMIN', 'ROLE_EMPLOYEE'];

function App() {
    return (
        <AuthProvider>
        <CartProvider>
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Each portal is only opened for the right role */}
                <Route path="/admin" element={
                    <ProtectedRoute roles={['ROLE_ADMIN']}><EmployeeDashboard admin /></ProtectedRoute>
                } />
                <Route path="/employee/dashboard" element={
                    <ProtectedRoute roles={STAFF}><EmployeeDashboard /></ProtectedRoute>
                } />
                <Route path="/customer/dashboard" element={
                    <ProtectedRoute roles={['ROLE_CUSTOMER']}><Customer /></ProtectedRoute>
                } />
                <Route path="/service-management" element={
                    <ProtectedRoute roles={STAFF}><ServiceManagement /></ProtectedRoute>
                } />

                <Route path="/about" element={<About />}/>
                <Route path="/contact" element={<Contact />}/>
                <Route path="/products" element={<Product />}/>
                <Route path="/cart" element={<Cart />}/>
                <Route path="/services" element={<ServiceCatalogue />}/>
                <Route path="/appointment" element={<BookAppointment />}/>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </BrowserRouter>
        </CartProvider>
        </AuthProvider>
    );
}

export default App;
