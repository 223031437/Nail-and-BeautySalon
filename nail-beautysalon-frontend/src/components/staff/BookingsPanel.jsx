import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {
    cancelBooking, getAllBookings, rescheduleBooking, setBookingStatus,
} from '../../services/bookingService';
import { getErrorMessage } from '../../services/api';
import { formatDateTime, formatMoney } from '../../utils';
import SlotPicker from '../SlotPicker';

const FILTERS = ['All', 'Confirmed', 'Completed', 'Cancelled'];

/** Staff view of every booking: change the time slot, cancel, or mark as completed. */
function BookingsPanel() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newSlot, setNewSlot] = useState('');
    const [slotRefresh, setSlotRefresh] = useState(0);
    const [busyId, setBusyId] = useState(null);
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    const load = useCallback(async () => {
        try {
            setBookings(await getAllBookings());
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to load bookings.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return bookings.filter((b) => {
            if (filter !== 'All' && b.status !== filter) return false;
            if (!q) return true;
            return [b.appointmentId, b.customerName, b.customerEmail, b.serviceSelected]
                .some((v) => (v || '').toLowerCase().includes(q));
        });
    }, [bookings, filter, search]);

    const run = async (id, action, message) => {
        setBusyId(id);
        setError('');
        setSuccess('');
        try {
            await action();
            setSuccess(message);
            setEditingId(null);
            setConfirmCancelId(null);
            setNewSlot('');
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
            if (err?.response?.status === 409) {
                setNewSlot('');
                setSlotRefresh((n) => n + 1);
            }
        } finally {
            setBusyId(null);
        }
    };

    const saveSlot = (b) => {
        if (!newSlot) {
            setError('Please choose a new date and an available time slot first.');
            return;
        }
        run(b.appointmentId, () => rescheduleBooking(b.appointmentId, newSlot),
            `Booking ${b.appointmentId} moved to ${formatDateTime(newSlot)}. The customer has been emailed.`);
    };

    return (
        <section className="portal-section">
            <h2>Bookings</h2>
            <p className="section-subtitle">Every booking made by customers. You can change the time slot or cancel a booking.</p>

            <div className="portal-toolbar">
                <div className="d-flex gap-2 flex-wrap">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={`chip${filter === f ? ' active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <input
                    className="portal-search"
                    placeholder="Search by name, email, service or reference"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search bookings"
                />
                <Button className="dashboard-button" onClick={load}>Refresh</Button>
            </div>

            {error && <p className="status-msg error" role="alert">{error}</p>}
            {success && <p className="status-msg success" role="status">{success}</p>}

            {loading ? (
                <p>Loading bookings…</p>
            ) : visible.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="portal-table-wrap">
                    <table className="portal-table">
                        <thead>
                            <tr>
                                <th>Ref</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date &amp; time</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((b) => (
                                <Fragment key={b.appointmentId}>
                                    <tr>
                                        <td data-label="Ref">{b.appointmentId}</td>
                                        <td data-label="Customer">
                                            {b.customerName}
                                            <br />
                                            <small>{b.customerEmail}</small>
                                            <br />
                                            <small>{b.customerCell}</small>
                                        </td>
                                        <td data-label="Service">{b.serviceSelected}</td>
                                        <td data-label="Date & time">{formatDateTime(b.dateTime)}</td>
                                        <td data-label="Status">
                                            <span className={`badge-status status-${(b.status || '').toLowerCase()}`}>{b.status}</span>
                                        </td>
                                        <td data-label="Payment">
                                            {formatMoney(b.amount)}
                                            <br />
                                            <small>{b.paymentMethod} · {b.paymentStatus}</small>
                                        </td>
                                        <td data-label="Actions">
                                            {b.status === 'Confirmed' ? (
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Button size="sm" className="dashboard-button" disabled={busyId === b.appointmentId}
                                                        onClick={() => { setEditingId(b.appointmentId); setNewSlot(''); setError(''); setSuccess(''); }}>
                                                        Change time
                                                    </Button>
                                                    <Button size="sm" variant="outline-light" disabled={busyId === b.appointmentId}
                                                        onClick={() => run(b.appointmentId, () => setBookingStatus(b.appointmentId, 'Completed'), `Booking ${b.appointmentId} marked as completed.`)}>
                                                        Complete
                                                    </Button>
                                                    {confirmCancelId === b.appointmentId ? (
                                                        <>
                                                            <Button size="sm" variant="danger" disabled={busyId === b.appointmentId}
                                                                onClick={() => run(b.appointmentId, () => cancelBooking(b.appointmentId), `Booking ${b.appointmentId} cancelled. The customer has been emailed.`)}>
                                                                Confirm cancel
                                                            </Button>
                                                            <Button size="sm" variant="outline-secondary" onClick={() => setConfirmCancelId(null)}>
                                                                Keep
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button size="sm" variant="outline-danger" onClick={() => setConfirmCancelId(b.appointmentId)}>
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <small>—</small>
                                            )}
                                        </td>
                                    </tr>
                                    {editingId === b.appointmentId && (
                                        <tr className="edit-row">
                                            <td colSpan={7}>
                                                <p><strong>New time slot for {b.customerName}</strong> (currently {formatDateTime(b.dateTime)})</p>
                                                <SlotPicker value={newSlot} onChange={setNewSlot} currentValue={b.dateTime} refreshKey={slotRefresh} />
                                                <div className="d-flex gap-2 mt-3">
                                                    <Button className="dashboard-button" disabled={busyId === b.appointmentId} onClick={() => saveSlot(b)}>
                                                        {busyId === b.appointmentId ? 'Saving…' : 'Save new time'}
                                                    </Button>
                                                    <Button variant="outline-secondary" onClick={() => setEditingId(null)}>Close</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default BookingsPanel;
