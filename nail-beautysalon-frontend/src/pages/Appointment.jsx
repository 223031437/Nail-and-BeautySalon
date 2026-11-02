
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { appointmentsApi } from '../api/appointments';
import { Notice } from '../components/UIState';
import { IconCalendar, IconCheck } from '../components/Icons';

const API_URL = 'http://localhost:8080';

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

const emptyForm = () => ({
  dateTime: '',
  serviceSelected: '',
  streetNumber: '',
  streetName: '',
  suburb: '',
  city: '',
  province: '',
  postalCode: '',
  notes: '',
});

const generateAppointmentId = () =>
  `APT-${Date.now().toString(36).toUpperCase()}`;

const BookAppointment = () => {
  const location = useLocation();
  const selectedService = location.state?.service;

  const [form, setForm] = useState(() => ({
    ...emptyForm(),
    serviceSelected: selectedService?.serviceName || '',
  }));

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Load services maintained by the backend.
  useEffect(() => {
    let active = true;

    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/service/getAll`);

        if (!response.ok) {
          throw new Error('Unable to load services. Please try again.');
        }

        const data = await response.json();

        if (active) {
          setServices(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (active) {
          setResult({
            ok: false,
            message: error.message || 'Unable to load services.',
          });
        }
      } finally {
        if (active) {
          setLoadingServices(false);
        }
      }
    };

    fetchServices();

    return () => {
      active = false;
    };
  }, []);

  // Preselect the service sent from ServiceDetails.
  useEffect(() => {
    if (selectedService?.serviceName) {
      setForm((current) => ({
        ...current,
        serviceSelected: selectedService.serviceName,
      }));
    }
  }, [selectedService?.serviceName]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setResult(null);

    if (!form.dateTime) {
      setResult({
        ok: false,
        message: 'Please select a date and time.',
      });
      return;
    }

    if (!form.serviceSelected) {
      setResult({
        ok: false,
        message: 'Please select a service.',
      });
      return;
    }

    if (!form.province) {
      setResult({
        ok: false,
        message: 'Please select a province.',
      });
      return;
    }

    if (!/^\d{4}$/.test(form.postalCode.trim())) {
      setResult({
        ok: false,
        message: 'Please enter a valid 4-digit postal code.',
      });
      return;
    }

    const selectedDate = new Date(form.dateTime);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate <= new Date()
    ) {
      setResult({
        ok: false,
        message: 'Please select a future date and time.',
      });
      return;
    }

    const payload = {
      appointmentId: generateAppointmentId(),
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
      notes: form.notes.trim(),
      status: 'Pending',
    };

    try {
      setSubmitting(true);

      await appointmentsApi.create(payload);

      setResult({
        ok: true,
        message:
          `Booked! Your reference is ${payload.appointmentId}. ` +
          'The studio will confirm your appointment shortly.',
      });

      setForm(emptyForm());
    } catch (error) {
      console.error('Appointment booking error:', error);

      setResult({
        ok: false,
        message:
          error?.message ||
          'Unable to book your appointment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section form-page">
      <div className="container form-page__grid">
        <div className="form-page__intro">
          <span className="eyebrow">Reserve your slot</span>

          <h1>Book an appointment</h1>

          <p className="lede">
            Choose your service, select a suitable date and time,
            and provide your contact address.
          </p>

          <div className="form-page__note card">
            <IconCalendar width={18} height={18} />

            <span>
              Bookings are reviewed by the studio and confirmed
              by phone or email before your appointment is locked in.
            </span>
          </div>
        </div>

        <form
          className="card form-card"
          onSubmit={handleSubmit}
          noValidate
        >
          {result && (
            <Notice type={result.ok ? 'success' : 'error'}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {result.ok && (
                  <IconCheck width={16} height={16} />
                )}

                {result.message}
              </span>
            </Notice>
          )}

          <div className="form-row">
            <div className="field">
              <label htmlFor="serviceSelected">Service</label>

              <select
                id="serviceSelected"
                name="serviceSelected"
                value={form.serviceSelected}
                onChange={handleChange}
                required
                disabled={loadingServices}
              >
                <option value="">
                  {loadingServices
                    ? 'Loading services...'
                    : 'Choose a service'}
                </option>

                {form.serviceSelected &&
                  !services.some(
                    (service) =>
                      service.serviceName === form.serviceSelected
                  ) && (
                    <option value={form.serviceSelected}>
                      {form.serviceSelected}
                    </option>
                  )}

                {services.map((service) => (
                  <option
                    key={service.serviceId}
                    value={service.serviceName}
                  >
                    {service.serviceName}
                    {service.price != null
                      ? ` — R${Number(service.price).toFixed(2)}`
                      : ''}
                  </option>
                ))}
              </select>

              {!loadingServices && services.length === 0 && (
                <small>
                  Services could not be loaded. Check that the
                  backend is running and has services available.
                </small>
              )}
            </div>

            <div className="field">
              <label htmlFor="dateTime">Date &amp; time</label>

              <input
                id="dateTime"
                type="datetime-local"
                name="dateTime"
                value={form.dateTime}
                onChange={handleChange}
                min={getLocalDateTime()}
                required
              />
            </div>
          </div>

          <p className="form-card__subhead">
            Your contact address
          </p>

          <div className="form-row">
            <div className="field">
              <label htmlFor="streetNumber">Street number</label>
              <input
                id="streetNumber"
                name="streetNumber"
                value={form.streetNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="streetName">Street name</label>
              <input
                id="streetName"
                name="streetName"
                value={form.streetName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="suburb">Suburb</label>
              <input
                id="suburb"
                name="suburb"
                value={form.suburb}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="province">Province</label>

              <select
                id="province"
                name="province"
                value={form.province}
                onChange={handleChange}
                required
              >
                <option value="">Select a province</option>

                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="postalCode">Postal code</label>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">
              Notes for your artist (optional)
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Allergies, preferences, anything we should know..."
              rows={4}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting || loadingServices}
          >
            {submitting ? 'Booking...' : 'Request appointment'}
          </button>
        </form>
      </div>
    </section>
  );
};

function getLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default BookAppointment;
