import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { deleteInquiry, getAllInquiries, respondToInquiry } from '../../services/bookingService';
import { getErrorMessage } from '../../services/api';
import { formatDateTime } from '../../utils';
import FieldError from '../FieldError';

const FILTERS = ['All', 'New', 'Responded'];

/** Messages sent from the Contact page. An employee answers by email or records a phone call. */
function MessagesPanel({ isAdmin }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('New');
    const [openId, setOpenId] = useState(null);
    const [channel, setChannel] = useState('email');
    const [reply, setReply] = useState('');
    const [replyError, setReplyError] = useState('');
    const [busyId, setBusyId] = useState(null);

    const load = useCallback(async () => {
        try {
            setMessages(await getAllInquiries());
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to load messages.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const visible = useMemo(
        () => messages.filter((m) => filter === 'All' || m.status === filter),
        [messages, filter]
    );
    const newCount = messages.filter((m) => m.status === 'New').length;

    const open = (m) => {
        setOpenId(m.inquiryId);
        setChannel('email');
        setReply('');
        setReplyError('');
        setError('');
        setSuccess('');
    };

    const send = async (m) => {
        if (!reply.trim()) {
            setReplyError(channel === 'email' ? 'Please write your reply first' : 'Please write a note about the call');
            return;
        }
        setBusyId(m.inquiryId);
        setError('');
        setSuccess('');
        try {
            const text = channel === 'email' ? reply.trim() : `Responded by phone call: ${reply.trim()}`;
            await respondToInquiry(m.inquiryId, text, channel === 'email');
            setSuccess(channel === 'email' ? `Reply emailed to ${m.email}.` : 'Call note saved and the message marked as responded.');
            setOpenId(null);
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (m) => {
        if (!window.confirm('Delete this message permanently?')) return;
        setBusyId(m.inquiryId);
        try {
            await deleteInquiry(m.inquiryId);
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="portal-section">
            <h2>Messages {newCount > 0 && <span className="badge-status status-new">{newCount} new</span>}</h2>
            <p className="section-subtitle">Messages from the Contact page. Reply by email, or call the customer and record it here.</p>

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
                <p>Loading messages…</p>
            ) : visible.length === 0 ? (
                <p>No messages here.</p>
            ) : (
                <div className="booking-list">
                    {visible.map((m) => (
                        <div className="dashboard-card booking-card p-4" key={m.inquiryId}>
                            <div className="booking-card__head">
                                <div>
                                    <h3>{m.fullName}</h3>
                                    <p className="booking-ref">
                                        {(m.subject || '').replace(/_/g, ' ')} · {formatDateTime(m.createdAt)}
                                    </p>
                                </div>
                                <span className={`badge-status status-${(m.status || '').toLowerCase()}`}>{m.status}</span>
                            </div>

                            <p>
                                <strong>Email:</strong> <a href={`mailto:${m.email}`}>{m.email}</a>
                                {' · '}
                                <strong>Phone:</strong> <a href={`tel:${m.phoneNumber}`}>{m.phoneNumber}</a>
                            </p>
                            <p className="message-body">{m.message}</p>

                            {m.response && (
                                <div className="reschedule-box">
                                    <p><strong>Response</strong> by {m.respondedBy} · {formatDateTime(m.respondedAt)}</p>
                                    <p className="message-body">{m.response}</p>
                                </div>
                            )}

                            {openId === m.inquiryId ? (
                                <div className="reschedule-box">
                                    <div className="d-flex gap-3 mb-2 flex-wrap">
                                        <label className="radio-label">
                                            <input type="radio" name={`ch-${m.inquiryId}`} checked={channel === 'email'} onChange={() => { setChannel('email'); setReplyError(''); }} />
                                            {' '}Reply by email
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" name={`ch-${m.inquiryId}`} checked={channel === 'call'} onChange={() => { setChannel('call'); setReplyError(''); }} />
                                            {' '}I called the customer
                                        </label>
                                    </div>
                                    <textarea
                                        className="portal-textarea"
                                        rows={4}
                                        value={reply}
                                        onChange={(e) => { setReply(e.target.value); setReplyError(''); }}
                                        placeholder={channel === 'email' ? 'Write your reply to the customer…' : 'What did you discuss on the call?'}
                                    />
                                    <FieldError message={replyError} />
                                    <div className="d-flex gap-2 mt-2 flex-wrap">
                                        <Button className="dashboard-button" disabled={busyId === m.inquiryId} onClick={() => send(m)}>
                                            {busyId === m.inquiryId ? 'Saving…' : channel === 'email' ? 'Send email reply' : 'Save call note'}
                                        </Button>
                                        <Button variant="outline-secondary" onClick={() => setOpenId(null)}>Close</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button className="dashboard-button" onClick={() => open(m)}>
                                        {m.status === 'New' ? 'Respond' : 'Respond again'}
                                    </Button>
                                    {isAdmin && (
                                        <Button variant="outline-danger" disabled={busyId === m.inquiryId} onClick={() => remove(m)}>
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MessagesPanel;
