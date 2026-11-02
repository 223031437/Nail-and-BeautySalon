import { useCallback, useEffect, useState } from 'react';
import { getAvailability } from '../services/bookingService';
import { getErrorMessage } from '../services/api';
import { todayString } from '../utils';

/**
 * Pick a date, then pick one of that day's time slots.
 * Slots that are already booked (or in the past) are shown greyed out and cannot be chosen.
 * `value` / `onChange` use the format "YYYY-MM-DDTHH:mm".
 */
function SlotPicker({ value, onChange, currentValue, refreshKey = 0, disabled = false }) {
  const [date, setDate] = useState(value ? value.slice(0, 10) : '');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (day) => {
    if (!day) {
      setSlots([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setSlots(await getAvailability(day));
    } catch (err) {
      setSlots([]);
      setError(getErrorMessage(err, 'Could not load the available time slots.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load, refreshKey]);

  const handleDate = (event) => {
    setDate(event.target.value);
    onChange('');
  };

  const selectedTime = value && value.slice(0, 10) === date ? value.slice(11, 16) : '';

  return (
    <div className="slot-picker">
      <input
        type="date"
        value={date}
        min={todayString()}
        onChange={handleDate}
        disabled={disabled}
        aria-label="Appointment date"
      />

      {!date && <small className="slot-hint">Choose a date to see the available time slots.</small>}
      {loading && <small className="slot-hint">Loading time slots…</small>}
      {error && <small className="field-error" role="alert">{error}</small>}

      {date && !loading && !error && slots.length === 0 && (
        <small className="slot-hint">The salon is closed on this day. Please choose another date.</small>
      )}

      {slots.length > 0 && (
        <div className="slot-grid" role="group" aria-label="Available time slots">
          {slots.map((slot) => {
            const isCurrent = currentValue && slot.dateTime && slot.dateTime.slice(0, 16) === currentValue.slice(0, 16);
            const isSelected = selectedTime === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                className={`slot-button${isSelected ? ' selected' : ''}${slot.available ? '' : ' unavailable'}`}
                disabled={!slot.available || disabled}
                aria-pressed={isSelected}
                title={slot.available ? 'Available' : isCurrent ? 'Your current time' : 'Unavailable'}
                onClick={() => onChange(`${date}T${slot.time}`)}
              >
                {slot.time}
                {!slot.available && <span className="slot-tag">{isCurrent ? 'current' : 'taken'}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SlotPicker;
