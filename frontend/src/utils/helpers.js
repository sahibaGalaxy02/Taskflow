// Format date for display
export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Check if a date is overdue
export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
};

// Format date for input[type=date]
export const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};

// Get priority config
export const getPriorityConfig = (priority) => {
  const map = {
    low:    { label: 'Low',    color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    medium: { label: 'Medium', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
    high:   { label: 'High',   color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20'     },
  };
  return map[priority] || map.medium;
};

// Get status config
export const getStatusConfig = (status) => {
  const map = {
    todo:  { label: 'To Do',      color: 'text-slate-400',   accent: '#64748b' },
    doing: { label: 'In Progress', color: 'text-indigo-400',  accent: '#6366f1' },
    done:  { label: 'Done',        color: 'text-emerald-400', accent: '#10b981' },
  };
  return map[status] || map.todo;
};

// Truncate text
export const truncate = (str, n = 80) =>
  str && str.length > n ? str.substring(0, n) + '…' : str;

// Get initials from name
export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
