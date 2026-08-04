import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Phone, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';
import { useAccounts } from '../context/AccountsContext';
import { TECHNICIAN_DEFAULT_PERMISSIONS } from '../utils/permissions';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addClient } = useAccounts();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !username.trim() || !password) {
      setError('Name, username, and password are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = addClient({
      name: name.trim(),
      username: username.trim(),
      password,
      email: email.trim(),
      phone: phone.trim(),
      role: 'technician',
      permissions: { ...TECHNICIAN_DEFAULT_PERMISSIONS },
    });

    if (result.success) {
      navigate('/login', { state: { signupSuccess: true } });
    } else {
      setError(result.error ?? 'Failed to create account.');
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-orca-royal-dark py-8">
      <div className="absolute inset-0 bg-orca-login" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orca-royal/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orca-teal/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8">
          <Logo variant="full" />
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/95 p-8 shadow-orca backdrop-blur-xl">
          <h2 className="mb-1 text-center text-lg font-bold text-orca-royal-dark">
            Create account
          </h2>
          <p className="mb-6 text-center text-xs text-slate-500">
            Sign up for the ORCA IT CRM portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="relative">
              <UserPlus size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type="text"
                placeholder="Full name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-11 focus:border-orca-teal focus:ring-orca-teal/20"
                required
              />
            </div>

            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type="text"
                placeholder="Username *"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-11 focus:border-orca-teal focus:ring-orca-teal/20"
                required
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11 pr-11 focus:border-orca-teal focus:ring-orca-teal/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orca-royal-dark"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-11 focus:border-orca-teal focus:ring-orca-teal/20"
                required
              />
            </div>

            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11 focus:border-orca-teal focus:ring-orca-teal/20"
              />
            </div>

            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-11 focus:border-orca-teal focus:ring-orca-teal/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orca-royal px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-orca-royal-dark disabled:opacity-60"
            >
              {loading ? '...' : 'SIGN UP'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orca-royal hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs font-semibold tracking-wide text-orca-yellow">
          orcait.com.au
        </p>
      </div>
    </div>
  );
}
