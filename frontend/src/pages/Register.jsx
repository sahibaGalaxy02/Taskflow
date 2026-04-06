import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
    return () => dispatch(clearError());
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 mb-5">
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="9" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="9" y="1" width="6" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="8" width="6" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">
            Task<span className="text-indigo-400">Flow</span>
          </h1>
          <p className="text-slate-500 text-sm">Create your workspace</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-display font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="input-field"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-display font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center py-3 mt-1 text-base rounded-xl w-full"
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
