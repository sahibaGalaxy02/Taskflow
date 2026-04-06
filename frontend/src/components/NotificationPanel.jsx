import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
  clearAllNotifications,
  checkOverdue,
} from '../store/slices/notificationsSlice';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  task_created:  { icon: '✅', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  task_updated:  { icon: '✏️', color: 'text-indigo-400',  bg: 'bg-indigo-400/10'  },
  task_deleted:  { icon: '🗑️', color: 'text-red-400',     bg: 'bg-red-400/10'     },
  task_overdue:  { icon: '⚠️', color: 'text-amber-400',   bg: 'bg-amber-400/10'   },
  task_moved:    { icon: '🔀', color: 'text-violet-400',  bg: 'bg-violet-400/10'  },
  board_created: { icon: '📋', color: 'text-blue-400',    bg: 'bg-blue-400/10'    },
  board_deleted: { icon: '🗑️', color: 'text-red-400',     bg: 'bg-red-400/10'     },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount, loading } = useSelector((s) => s.notifications);
  const { token } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Fetch on mount + every 60s
  useEffect(() => {
    if (!token) return;
    dispatch(fetchNotifications());
    dispatch(checkOverdue());
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
      dispatch(checkOverdue());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch, token]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) dispatch(fetchNotifications());
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      await dispatch(markOneRead(notif._id));
    }
    if (notif.meta?.boardId) {
      navigate(`/board/${notif.meta.boardId}`);
      setOpen(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = async () => {
    await dispatch(markAllRead());
    toast.success('All notifications marked as read');
  };

  const handleClearAll = async () => {
    await dispatch(clearAllNotifications());
    toast.success('Notifications cleared');
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-lg transition-all duration-200
          ${open
            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
          }`}
        title="Notifications"
      >
        {/* Bell icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-indigo-500 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center px-1 shadow-lg shadow-indigo-500/40 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[520px] flex flex-col rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 z-50 animate-scale-in overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-slate-100 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-slate-500 hover:text-indigo-400 px-2 py-1 rounded-md hover:bg-indigo-400/10 transition-all"
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              {items.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-red-400 px-2 py-1 rounded-md hover:bg-red-400/10 transition-all"
                  title="Clear all"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto flex-1">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-4 text-2xl">
                  🔔
                </div>
                <p className="text-slate-400 font-display font-medium text-sm mb-1">All caught up!</p>
                <p className="text-slate-600 text-xs">No notifications yet. Create tasks and boards to see activity here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {items.map((notif) => {
                  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.task_updated;
                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleNotifClick(notif)}
                      className={`group relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150
                        ${!notif.read
                          ? 'bg-indigo-500/5 hover:bg-indigo-500/10'
                          : 'hover:bg-slate-800/40'
                        }`}
                    >
                      {/* Unread dot */}
                      {!notif.read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                      )}

                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center text-sm mt-0.5`}>
                        {cfg.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-display font-semibold mb-0.5 ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-slate-600 font-mono">
                            {timeAgo(notif.createdAt)}
                          </span>
                          {notif.meta?.boardTitle && (
                            <>
                              <span className="text-slate-700 text-[10px]">·</span>
                              <span className="text-[11px] text-slate-600 truncate max-w-[120px]">
                                {notif.meta.boardTitle}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Delete btn */}
                      <button
                        onClick={(e) => handleDelete(e, notif._id)}
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Dismiss"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-800 px-4 py-2.5 flex-shrink-0">
              <p className="text-[11px] text-slate-600 text-center font-mono">
                {items.length} notification{items.length !== 1 ? 's' : ''} · auto-clears after 30 days
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
