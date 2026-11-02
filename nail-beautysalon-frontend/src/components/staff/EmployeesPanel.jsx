import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { authService } from '../../services/authService';
import { deleteEmployee, getAllEmployees } from '../../services/employeeService';
import { getErrorMessage, getFieldErrors } from '../../services/api';
import FieldError from '../FieldError';
import { hasErrors, required, validEmail, validPassword, validPhone } from '../../utils';

const empty = { firstName: '', lastName: '', email: '', cellNumber: '', employeeRole: '', password: '' };

/** Admin only: register new employees (they get a login) and remove old ones. */
function EmployeesPanel() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const load = useCallback(async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(res.data);
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to load employees.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const found = {
            firstName: required(form.firstName, 'First name'),
            lastName: required(form.lastName, 'Last name'),
            email: validEmail(form.email),
            cellNumber: validPhone(form.cellNumber),
            employeeRole: required(form.employeeRole, 'Role'),
            password: validPassword(form.password),
        };
        setErrors(found);
        if (hasErrors(found)) {
            setError('Please fill in all the required fields marked below.');
            return;
        }
        setSaving(true);
        try {
            await authService.registerEmployee(form);
            setSuccess(`${form.firstName} ${form.lastName} is registered and can now log in with ${form.email.trim().toLowerCase()}.`);
            setForm(empty);
            await load();
        } catch (err) {
            setErrors(getFieldErrors(err));
            setError(getErrorMessage(err, 'Registration failed'));
        } finally {
            setSaving(false);
        }
    };

    const remove = async (emp) => {
        if (!window.confirm(`Remove ${emp.firstName} ${emp.lastName}? Their login will be deleted too.`)) return;
        setError('');
        setSuccess('');
        try {
            await deleteEmployee(emp.userId);
            setSuccess(`${emp.firstName} ${emp.lastName} was removed.`);
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <section className="portal-section">
            <h2>Employees</h2>
            <p className="section-subtitle">Register a new employee. They log in with the email and password you set here.</p>

            {error && <p className="status-msg error" role="alert">{error}</p>}
            {success && <p className="status-msg success" role="status">{success}</p>}

            <form className="dashboard-card p-4 mb-4 portal-form" onSubmit={submit} noValidate>
                <div className="portal-form-grid">
                    {[
                        ['firstName', 'First name', 'text'],
                        ['lastName', 'Last name', 'text'],
                        ['email', 'Email (login)', 'email'],
                        ['cellNumber', 'Cell number', 'tel'],
                        ['employeeRole', 'Role (e.g. Nail Technician)', 'text'],
                        ['password', 'Temporary password (min 8 characters)', 'password'],
                    ].map(([name, label, type]) => (
                        <div key={name}>
                            <label htmlFor={`emp-${name}`}>{label}</label>
                            <input id={`emp-${name}`} name={name} type={type} value={form[name]} onChange={handleChange} disabled={saving} />
                            <FieldError message={errors[name]} />
                        </div>
                    ))}
                </div>
                <Button type="submit" className="dashboard-button mt-3" disabled={saving}>
                    {saving ? 'Registering…' : 'Register employee'}
                </Button>
            </form>

            {loading ? (
                <p>Loading employees…</p>
            ) : employees.length === 0 ? (
                <p>No employees registered yet.</p>
            ) : (
                <div className="portal-table-wrap">
                    <table className="portal-table">
                        <thead>
                            <tr><th>Name</th><th>Email</th><th>Cell</th><th>Role</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.userId}>
                                    <td data-label="Name">{emp.firstName} {emp.lastName}</td>
                                    <td data-label="Email">{emp.email}</td>
                                    <td data-label="Cell">{emp.cellNumber}</td>
                                    <td data-label="Role">{emp.role}</td>
                                    <td data-label="Actions">
                                        <Button size="sm" variant="outline-danger" onClick={() => remove(emp)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default EmployeesPanel;
