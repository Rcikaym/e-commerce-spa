import PropTypes from 'prop-types';
import './Input.css';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  name,
  id,
  className = '',
}) => {
  const fieldClasses = [
    'input-group__field',
    error ? 'input-group__field--error' : '',
  ].filter(Boolean).join(' ');

  const groupClasses = [
    'input-group',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {label && (
        <label className="input-group__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={fieldClasses}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && (
        <span className="input-group__error">{error}</span>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
