import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { getInitials } from '../utils/helpers';
import NotificationPanel from './NotificationPanel';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="9" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="9" y="1" width="6" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
                <rect x="9" y="8" width="6" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <span className="font-display font-700 text-lg tracking-tight text-white">
              Task<span className="text-indigo-400">Flow</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                {/* Notification Bell */}
                <NotificationPanel />

                {/* Divider */}
                <div className="w-px h-5 bg-slate-800 mx-1" />

                {/* User avatar + name */}
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-display font-semibold text-white">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{user.name}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg border border-transparent hover:border-red-400/20 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
