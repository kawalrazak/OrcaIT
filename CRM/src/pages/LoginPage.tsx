import { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login, authError } = useAuth();
  const { notify } = useToast();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem('orcait-signed-out');
    if (!name) return;
    sessionStorage.removeItem('orcait-signed-out');
    notify({
      type: 'info',
      title: 'Signed out',
      message: `${name} has signed out.`,
    });
  }, [notify]);

  function handleSignIn() {
    setStarting(true);
    login();
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
            Welcome back
          </h2>
          <p className="mb-6 text-center text-xs text-slate-500">
            Sign in to the ORCA IT CRM with your organisation account
          </p>

          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={starting || Boolean(authError)}
            className="w-full rounded-lg bg-orca-royal px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orca-royal-dark disabled:opacity-60"
          >
            {starting ? 'Redirecting to Keycloak...' : 'Sign in with Keycloak'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs font-semibold tracking-wide text-orca-yellow">
          orcait.com.au
        </p>
      </div>
    </div>
  );
}
