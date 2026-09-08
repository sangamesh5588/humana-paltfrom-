import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `hp-input-${Math.random().toString(36).substr(2, 9)}`;
  const containerClasses = [
    'hp-input-container',
    error ? 'hp-input-container--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label htmlFor={inputId} className="hp-input-label">{label}</label>}
      <input
        id={inputId}
        className="hp-input-field"
        {...props}
      />
      {error && <span className="hp-input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
