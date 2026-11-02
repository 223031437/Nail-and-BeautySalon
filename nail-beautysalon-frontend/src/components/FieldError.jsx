// Red message shown under a form field that is empty or invalid.
function FieldError({ message }) {
  if (!message) return null;
  return (
    <small className="field-error" role="alert">
      {message}
    </small>
  );
}

export default FieldError;
