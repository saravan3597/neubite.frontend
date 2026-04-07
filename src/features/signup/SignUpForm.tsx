import React, { useState } from 'react';
import { handleSignUp, handleConfirmSignUp } from '../auth/services/authService';
import { useSignUpStore } from './useSignUpStore';

interface SignUpFormProps {
  onToggleToLogin: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { isLoading, error, setLoading, setError } = useSignUpStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccessMsg('');
    try {
      await handleSignUp(email, password, name);
      setSuccessMsg('Account created! Check your email for a verification code.');
      setIsConfirming(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await handleConfirmSignUp(email, verificationCode);
      setSuccessMsg('Account verified! You can now sign in.');
      setIsConfirming(false);
    } catch (err: any) {
      setError(err.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-bg-secondary bg-bg-secondary text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-primary transition-all';

  const btnClass =
    'w-full py-3 rounded-xl text-base font-bold text-white bg-accent-primary hover:bg-accent-hover disabled:opacity-60 transition-colors shadow-sm';

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-text-primary mb-1.5">Create an account</h2>
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <button onClick={onToggleToLogin} className="text-accent-primary hover:text-accent-hover font-semibold transition-colors">
            Sign in
          </button>
        </p>
      </div>

      {successMsg && !isConfirming ? (
        <div className="space-y-5">
          <div className="px-4 py-3 rounded-xl bg-status-success/10 border border-status-success/20 text-sm text-status-success text-center">
            {successMsg}
          </div>
          <button onClick={onToggleToLogin} className={btnClass}>Return to Login</button>
        </div>

      ) : isConfirming ? (
        <form className="space-y-4" onSubmit={handleConfirmSubmit}>
          <div className="px-4 py-3 rounded-xl bg-status-success/10 border border-status-success/20 text-sm text-status-success text-center">
            {successMsg}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-status-error/10 border border-status-error/20 text-sm text-status-error text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-primary">
              Verification Code <span className="text-status-error">*</span>
            </label>
            <input
              type="text" inputMode="numeric" pattern="[0-9]*" required
              className={`${inputClass} font-mono tracking-[0.4em] text-xl text-center`}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isLoading} className={`${btnClass} mt-2`}>
            {isLoading ? 'Verifying…' : 'Verify account'}
          </button>
        </form>

      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 rounded-xl bg-status-error/10 border border-status-error/20 text-sm text-status-error text-center">
              {error}
            </div>
          )}

          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Jane Doe', value: name, onChange: setName },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', value: email, onChange: setEmail },
            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', value: password, onChange: setPassword },
          ].map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-primary">
                {field.label} <span className="text-status-error">*</span>
              </label>
              <input
                name={field.name} type={field.type} required
                placeholder={field.placeholder} value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={inputClass}
              />
            </div>
          ))}

          <button type="submit" disabled={isLoading} className={`${btnClass} mt-2`}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      )}
    </>
  );
};
