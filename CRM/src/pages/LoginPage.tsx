import { useState, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const signupSuccess = Boolean((location.state as { signupSuccess?: boolean } | null)?.signupSuccess);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!username.trim() || !password) {
        setError('Please enter username and password');
        setLoading(false);
        return;
      }

      const successLogin = login(username, password, remember);
      if (successLogin) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-orca-royal-dark py-8">
      <div className="absolute inset-0 bg-orca-login" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orca-royal/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orca-teal/20 blur-3xl" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGlsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0zNiAzNHYySDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8">
          <Logo variant="full" />
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/95 p-8 shadow-orca backdrop-blur-xl">
          <h2 className="mb-1 text-center text-lg font-bold text-orca-royal-dark">
            Welcome back
          </h2>
          <p className="mb-6 text-center text-xs text-slate-500">
            Sign in to the ORCA IT CRM portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {signupSuccess && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                Account created. Sign in with your new credentials.
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-11 focus:border-orca-teal focus:ring-orca-teal/20"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-royal" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11 pr-11 focus:border-orca-teal focus:ring-orca-teal/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orca-royal-dark"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-orca-royal focus:ring-orca-teal"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-orca-royal px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-orca-royal-dark disabled:opacity-60"
              >
                {loading ? '...' : 'LOGIN'}
              </button>
            </div>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-5 text-center">
            <p className="mb-3 text-sm text-slate-600">New user?</p>
            <Link
              to="/signup"
              className="inline-flex w-full items-center justify-center rounded-lg border border-orca-royal px-5 py-2.5 text-xs font-semibold text-orca-royal transition hover:bg-orca-royal hover:text-white"
            >
              SIGN UP
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-semibold tracking-wide text-orca-yellow">
          orcait.com.au
        </p>
      </div>
    </div>
  );
}
