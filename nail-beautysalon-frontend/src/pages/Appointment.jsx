import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { appointmentsApi } from '../api/appointments';
import { getServices } from '../services/bookingService';
import { getErrorMessage, getFieldErrors } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Notice } from '../components/UIState';
import { IconCalendar, IconCheck } from '../components/Icons';
import FieldError from '../components/FieldError';
import SlotPicker from '../components/SlotPicker';
import { hasErrors, required } from '../utils';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const PAYMENT_METHODS = ['Pay at salon', 'EFT / bank transfer', 'Card at salon'];

const emptyForm = () => ({
  dateTime: '',
  serviceSelected: '',
  streetNumber: '',
  streetName: '',
  suburb: '',
  city: '',
  province: '',
  postalCode: '',
  paymentMethod: '',
  notes: '',
});

const validate = (form) => ({
  serviceSelected: required(form.serviceSelected, 'Service'),
  dateTime: form.dateTime ? '' : 'Please choose a date and an available time slot',
  streetNumber: required(form.streetNumber, 'Street number'),
  streetName: required(form.streetName, 'Street name'),
  suburb: required(form.suburb, 'Suburb'),
  city: required(form.city, 'City'),
  province: required(form.province, 'Province'),
  postalCode: !form.postalCode.trim()
    ? 'Postal code is required'
    : /^\d{4}$/.test(form.postalCode.trim())
      ? ''
      : 'Postal code must be 4 digits',
  paymentMethod: required(form.paymentMethod, 'Payment method'),
});

const BookAppointment = () => {
  const location = useLocation();
  const { user } = useAuth();
  const selectedService = location.state?.service;

  const [form, setForm] = useState(() => ({
    ...emptyForm(),
    serviceSelected: selectedService?.serviceName || '',
  }));
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [slotRefresh, setSlotRefresh] = useState(0);

  // Load services maintained by the backend.
  useEffect(() => {
    let active = true;

    getServices()
      .then((data) => {
        if (active) setServices(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (active) setResult({ ok: false, message: getErrorMessage(error, 'Unable to load services.') });
      })
      .finally(() => {
        if (active) setLoadingServices(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSlot = (dateTime) => {
    setForm((current) => ({ ...current, dateTime }));
    setErrors((current) => ({ ...current, dateTime: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;
    setResult(null);

    const found = validate(form);
    setErrors(found);
    if (hasErrors(found)) {
      setResult({ ok: false, message: 'Please fill in all the required fields marked below.' });
      return;
    }

    const payload = {
      dateTime: form.dateTime,
      serviceSelected: form.serviceSelected,
      address: {
        streetNumber: form.streetNumber.trim(),
        streetName: form.streetName.trim(),
        suburb: form.suburb.trim(),
        city: form.city.trim(),
        province: form.province,
        postalCode: form.postalCode.trim(),
      },
      paymentMethod: form.paymentMethod,
      notes: form.notes.trim(),
    };

    try {
      setSubmitting(true);

      const booking = await appointmentsApi.create(payload);

      setResult({
        ok: true,
        message:
          `Booked! Your reference is ${booking.appointmentId}. ` +
          `A confirmation email has been sent to ${booking.customerEmail || 'you'}. ` +
          'You can change the time or cancel under "My Bookings" in your account.',
        showLink: true,
      });

      setForm(emptyForm());
      setErrors({});
    } catch (error) {
      setErrors(getFieldErrors(error));
      setResult({ ok: false, message: getErrorMessage(error, 'Unable to book your appointment. Please try again.') });
      // The slot may just have been taken by someone else - reload the slots and clear the choice.
      if (error?.response?.status === 409) {
        setForm((current) => ({ ...current, dateTime: '' }));
        setSlotRefresh((n) => n + 1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canBook = user?.role === 'ROLE_CUSTOMER';

  return (
    <section className="section form-page">
      <div className="container form-page__grid">
        <div className="form-page__intro">
          <span className="eyebrow">Reserve your slot</span>

          <h1>Book an appointment</h1>

          <p className="lede">
            Choose your service, pick an available time slot,
            and provide your contact address.
          </p>

          <div className="form-page__note card">
            <IconCalendar width={18} height={18} />

            <span>
              Time slots that are already booked are greyed out. You will get a
              confirmation email straight away, and you can change the time or
              cancel from your account.
            </span>
          </div>
        </div>

        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          {!user && (
            <Notice type="error">
              Please <Link to="/login">log in</Link> or <Link to="/signup">create an account</Link> to book an appointment.
            </Notice>
          )}

          {user && !canBook && (
            <Notice type="error">
              Appointments are booked by customers. You are signed in as staff, so use your dashboard to manage bookings.
            </Notice>
          )}

          {result && (
            <Notice type={result.ok ? 'success' : 'error'}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {result.ok && <IconCheck width={16} height={16} />}
                {result.message}
              </span>
              {result.showLink && (
                <span style={{ display: 'block', marginTop: 8 }}>
                  <Link to="/customer/dashboard">Go to My Bookings</Link>
                </span>
              )}
            </Notice>
          )}

          <div className="field">
            <label htmlFor="serviceSelected">Service</label>

            <select
              id="serviceSelected"
              name="serviceSelected"
              value={form.serviceSelected}
              onChange={handleChange}
              disabled={loadingServices}
              aria-invalid={!!errors.serviceSelected}
            >
              <option value="">{loadingServices ? 'Loading services...' : 'Choose a service'}</option>

              {form.serviceSelected &&
                !services.some((service) => service.serviceName === form.serviceSelected) && (
                  <option value={form.serviceSelected}>{form.serviceSelected}</option>
                )}

              {services.map((service) => (
                <option key={service.serviceId} value={service.serviceName}>
                  {service.serviceName}
                  {service.price != null ? ` — R${Number(service.price).toFixed(2)}` : ''}
                </option>
              ))}
            </select>
            <FieldError message={errors.serviceSelected} />

            {!loadingServices && services.length === 0 && (
              <small>Services could not be loaded. Check that the backend is running and has services available.</small>
            )}
          </div>

          <div className="field" style={{ marginTop: 22 }}>
            <label>Date &amp; time slot</label>
            <SlotPicker value={form.dateTime} onChange={handleSlot} refreshKey={slotRefresh} />
            <FieldError message={errors.dateTime} />
          </div>

          <p className="form-card__subhead">Your contact address</p>

          <div className="form-row">
            <div className="field">
              <label htmlFor="streetNumber">Street number</label>
              <input id="streetNumber" name="streetNumber" value={form.streetNumber} onChange={handleChange} />
              <FieldError message={errors.streetNumber} />
            </div>

            <div className="field">
              <label htmlFor="streetName">Street name</label>
              <input id="streetName" name="streetName" value={form.streetName} onChange={handleChange} />
              <FieldError message={errors.streetName} />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="suburb">Suburb</label>
              <input id="suburb" name="suburb" value={form.suburb} onChange={handleChange} />
              <FieldError message={errors.suburb} />
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} />
              <FieldError message={errors.city} />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="province">Province</label>

              <select id="province" name="province" value={form.province} onChange={handleChange}>
                <option value="">Select a province</option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <FieldError message={errors.province} />
            </div>

            <div className="field">
              <label htmlFor="postalCode">Postal code</label>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.postalCode}
                onChange={handleChange}
              />
              <FieldError message={errors.postalCode} />
            </div>
          </div>

          <p className="form-card__subhead">Payment</p>

          <div className="field">
            <label htmlFor="paymentMethod">How will you pay?</label>
            <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="">Select a payment method</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <FieldError message={errors.paymentMethod} />
            <small className="slot-hint">Payment is settled with the salon; your booking shows as “Pending” until it is received.</small>
          </div>

          <div className="field" style={{ marginTop: 22 }}>
            <label htmlFor="notes">Notes for your artist (optional)</label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Allergies, preferences, anything we should know..."
              rows={4}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting || loadingServices || !canBook}>
            {submitting ? 'Booking...' : 'Request appointment'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookAppointment;
