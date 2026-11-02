import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { getAllPayments, setPaymentStatus } from '../../services/bookingService';
import { getErrorMessage } from '../../services/api';
import { formatDateTime, formatMoney } from '../../utils';

const FILTERS = ['All', 'Pending', 'Paid', 'Refund Due', 'Refunded', 'Cancelled'];

/** Every payment record. Only the admin can change a payment's status (the backend enforces this). */
function PaymentsPanel({ isAdmin }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('All');
    const [busyId, setBusyId] = useState(null);

    const load = useCallback(async () => {
        try {
            setPayments(await getAllPayments());
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to load payments.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const visible = useMemo(
        () => payments.filter((p) => filter === 'All' || p.status === filter),
        [payments, filter]
    );

    const totalPaid = useMemo(
        () => payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
        [payments]
    );
    const totalPending = useMemo(
        () => payments.filter((p) => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
        [payments]
    );

    const change = async (p, status) => {
        setBusyId(p.paymentId);
        setError('');
        setSuccess('');
        try {
            await setPaymentStatus(p.paymentId, status);
            setSuccess(`Payment ${p.paymentId} marked as ${status}.`);
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="portal-section">
            <h2>Payments</h2>
            <p className="section-subtitle">
                Received: <strong>{formatMoney(totalPaid)}</strong> · Waiting to be paid: <strong>{formatMoney(totalPending)}</strong>
            </p>

            <div className="portal-toolbar">
                <div className="d-flex gap-2 flex-wrap">
                    {FILTERS.map((f) => (
                        <button key={f} type="button" className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                            {f}
                        </button>
                    ))}
                </div>
                <Button className="dashboard-button" onClick={load}>Refresh</Button>
            </div>

            {error && <p className="status-msg error" role="alert">{error}</p>}
            {success && <p className="status-msg success" role="status">{success}</p>}

            {loading ? (
                <p>Loading payments…</p>
            ) : visible.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div className="portal-table-wrap">
                    <table className="portal-table">
                        <thead>
                            <tr>
                                <th>Payment</th>
                                <th>Booking</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((p) => (
                                <tr key={p.paymentId}>
                                    <td data-label="Payment">{p.paymentId}<br /><small>{formatDateTime(p.createdAt)}</small></td>
                                    <td data-label="Booking">
                                        {p.appointmentId}<br />
                                        <small>{p.serviceSelected} · {formatDateTime(p.appointmentDateTime)}</small>
                                    </td>
                                    <td data-label="Customer">{p.customerName}<br /><small>{p.customerEmail}</small></td>
                                    <td data-label="Amount">{formatMoney(p.amount)}</td>
                                    <td data-label="Method">{p.method}</td>
                                    <td data-label="Status">
                                        <span className={`badge-status status-${p.status.toLowerCase().replace(' ', '-')}`}>{p.status}</span>
                                        {p.paidAt && <><br /><small>{formatDateTime(p.paidAt)}</small></>}
                                    </td>
                                    {isAdmin && (
                                        <td data-label="Actions">
                                            <div className="d-flex gap-2 flex-wrap">
                                                {p.status === 'Pending' && (
                                                    <Button size="sm" className="dashboard-button" disabled={busyId === p.paymentId} onClick={() => change(p, 'Paid')}>
                                                        Mark paid
                                                    </Button>
                                                )}
                                                {p.status === 'Refund Due' && (
                                                    <Button size="sm" className="dashboard-button" disabled={busyId === p.paymentId} onClick={() => change(p, 'Refunded')}>
                                                        Mark refunded
                                                    </Button>
                                                )}
                                                {p.status === 'Paid' && (
                                                    <Button size="sm" variant="outline-light" disabled={busyId === p.paymentId} onClick={() => change(p, 'Pending')}>
                                                        Undo paid
                                                    </Button>
                                                )}
                                                {['Pending', 'Paid', 'Refund Due'].indexOf(p.status) === -1 && <small>—</small>}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default PaymentsPanel;
