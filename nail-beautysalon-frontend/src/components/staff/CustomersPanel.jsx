import { useEffect, useMemo, useState } from 'react';
import { getAllCustomers } from '../../services/bookingService';
import { getErrorMessage } from '../../services/api';

/** Read-only list of registered customers. */
function CustomersPanel() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        getAllCustomers()
            .then(setCustomers)
            .catch((err) => setError(getErrorMessage(err, 'Unable to load customers.')))
            .finally(() => setLoading(false));
    }, []);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter((c) =>
            [c.firstName, c.lastName, c.email, c.cellNumber].some((v) => (v || '').toLowerCase().includes(q)));
    }, [customers, search]);

    return (
        <section className="portal-section">
            <h2>Customers</h2>
            <p className="section-subtitle">{customers.length} registered customer{customers.length === 1 ? '' : 's'}.</p>

            <div className="portal-toolbar">
                <input className="portal-search" placeholder="Search customers" value={search}
                    onChange={(e) => setSearch(e.target.value)} aria-label="Search customers" />
            </div>

            {error && <p className="status-msg error" role="alert">{error}</p>}

            {loading ? (
                <p>Loading customers…</p>
            ) : visible.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <div className="portal-table-wrap">
                    <table className="portal-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Cell</th></tr></thead>
                        <tbody>
                            {visible.map((c) => (
                                <tr key={c.userId}>
                                    <td data-label="Name">{c.firstName} {c.lastName}</td>
                                    <td data-label="Email">{c.email}</td>
                                    <td data-label="Cell">{c.cellNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default CustomersPanel;
