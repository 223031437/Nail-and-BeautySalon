import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { cancelBooking, getMyBookings, rescheduleBooking } from '../services/bookingService';
import { getErrorMessage } from '../services/api';
import { formatDateTime, formatMoney } from '../utils';
import SlotPicker from './SlotPicker';

/** The customer's own bookings, with "change time slot" and "cancel". */
function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newSlot, setNewSlot] = useState('');
    const [slotRefresh, setSlotRefresh] = useState(0);
    const [busyId, setBusyId] = useState(null);
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    const load = useCallback(async () => {
        try {
            setBookings(await getMyBookings());
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to load your bookings.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const startEdit = (booking) => {
        setEditingId(booking.appointmentId);
        setNewSlot('');
        setError('');
        setSuccess('');
    };

    const saveSlot = async (booking) => {
        if (!newSlot) {
            setError('Please choose a new date and an available time slot first.');
            return;
        }
        setBusyId(booking.appointmentId);
        setError('');
        setSuccess('');
        try {
            await rescheduleBooking(booking.appointmentId, newSlot);
            setSuccess(`Booking ${booking.appointmentId} moved to ${formatDateTime(newSlot)}. A confirmation email is on its way.`);
            setEditingId(null);
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

    const doCancel = async (booking) => {
        setBusyId(booking.appointmentId);
        setError('');
        setSuccess('');
        try {
            await cancelBooking(booking.appointmentId);
            setSuccess(`Booking ${booking.appointmentId} has been cancelled.`);
            setConfirmCancelId(null);
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusyId(null);
        }
    };

    const isActive = (b) => b.status === 'Confirmed';

    return (
        <section className="portal-section">
            <h2>My bookings</h2>
            <p className="section-subtitle">Change the time of an appointment or cancel it. Only free time slots can be chosen.</p>

            {error && <p className="status-msg error" role="alert">{error}</p>}
            {success && <p className="status-msg success" role="status">{success}</p>}

            {loading ? (
                <p>Loading your bookings…</p>
            ) : bookings.length === 0 ? (
                <div className="dashboard-card p-4">
                    <h3>No bookings yet</h3>
                    <p>When you book an appointment it will appear here.</p>
                    <Button as={Link} to="/appointment" className="dashboard-button">Book an appointment</Button>
                </div>
            ) : (
                <div className="booking-list">
                    {bookings.map((b) => (
                        <div className="dashboard-card booking-card p-4" key={b.appointmentId}>
                            <div className="booking-card__head">
                                <div>
                                    <h3>{b.serviceSelected}</h3>
                                    <p className="booking-ref">Ref {b.appointmentId}</p>
                                </div>
                                <span className={`badge-status status-${(b.status || '').toLowerCase()}`}>{b.status}</span>
                            </div>

                            <p><strong>When:</strong> {formatDateTime(b.dateTime)}</p>
                            <p><strong>Payment:</strong> {formatMoney(b.amount)} · {b.paymentMethod} · {b.paymentStatus}</p>
                            {b.notes && <p><strong>Notes:</strong> {b.notes}</p>}

                            {isActive(b) && editingId !== b.appointmentId && (
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button className="dashboard-button" onClick={() => startEdit(b)} disabled={busyId === b.appointmentId}>
                                        Change time slot
                                    </Button>
                                    {confirmCancelId === b.appointmentId ? (
                                        <>
                                            <Button variant="danger" onClick={() => doCancel(b)} disabled={busyId === b.appointmentId}>
                                                {busyId === b.appointmentId ? 'Cancelling…' : 'Yes, cancel booking'}
                                            </Button>
                                            <Button variant="outline-secondary" onClick={() => setConfirmCancelId(null)}>
                                                Keep booking
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline-danger" onClick={() => setConfirmCancelId(b.appointmentId)}>
                                            Cancel booking
                                        </Button>
                                    )}
                                </div>
                            )}

                            {editingId === b.appointmentId && (
                                <div className="reschedule-box">
                                    <p><strong>Pick a new time slot</strong> (greyed-out slots are unavailable)</p>
                                    <SlotPicker
                                        value={newSlot}
                                        onChange={setNewSlot}
                                        currentValue={b.dateTime}
                                        refreshKey={slotRefresh}
                                    />
                                    <div className="d-flex gap-2 mt-3 flex-wrap">
                                        <Button className="dashboard-button" onClick={() => saveSlot(b)} disabled={busyId === b.appointmentId}>
                                            {busyId === b.appointmentId ? 'Saving…' : 'Save new time'}
                                        </Button>
                                        <Button variant="outline-secondary" onClick={() => setEditingId(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MyBookings;
