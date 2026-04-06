import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { updateTask, optimisticStatusUpdate } from '../store/slices/tasksSlice';
import TaskCard from './TaskCard';
import toast from 'react-hot-toast';

const ITEM_TYPE = 'TASK';

const COLUMN_CONFIG = {
  todo: {
    label: 'To Do',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    accent: '#64748b',
    badge: 'bg-slate-700/60 text-slate-400',
    border: 'border-slate-800',
    header: 'bg-slate-900/40',
  },
  doing: {
    label: 'In Progress',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    accent: '#6366f1',
    badge: 'bg-indigo-500/20 text-indigo-400',
    border: 'border-indigo-500/20',
    header: 'bg-indigo-950/30',
  },
  done: {
    label: 'Done',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: '#10b981',
    badge: 'bg-emerald-500/20 text-emerald-400',
    border: 'border-emerald-500/20',
    header: 'bg-emerald-950/30',
  },
};

const Column = ({ status, tasks, onAddTask, onEditTask }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const config = COLUMN_CONFIG[status];

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: async (item) => {
      if (item.status === status) return;
      // Optimistic update
      dispatch(optimisticStatusUpdate({ id: item.id, status }));
      const res = await dispatch(updateTask({ id: item.id, data: { status } }));
      if (updateTask.rejected.match(res)) {
        // Revert on failure
        dispatch(optimisticStatusUpdate({ id: item.id, status: item.status }));
        toast.error('Failed to move task');
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`flex flex-col rounded-2xl border transition-all duration-200 min-h-[500px]
        ${config.border}
        ${isOver ? 'shadow-lg scale-[1.01]' : ''}
      `}
      style={{
        background: isOver
          ? `${config.accent}08`
          : 'rgba(15, 20, 40, 0.4)',
        borderColor: isOver ? `${config.accent}40` : undefined,
      }}
    >
      {/* Column Header */}
      <div
        className={`flex items-center justify-between px-4 py-3.5 rounded-t-2xl border-b ${config.header}`}
        style={{ borderColor: `${config.accent}20` }}
      >
        <div className="flex items-center gap-2.5">
          <div style={{ color: config.accent }}>{config.icon}</div>
          <h3 className="font-display font-semibold text-sm text-slate-200">{config.label}</h3>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-semibold ${config.badge}`}>
            {tasks.length}
          </span>
        </div>

        <button
          onClick={onAddTask}
          className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-all duration-150"
          title={`Add task to ${config.label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto">
        {tasks.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center flex-1 rounded-xl border-2 border-dashed py-10 px-4 text-center transition-colors duration-200
              ${isOver ? 'border-current opacity-60' : 'border-slate-800 opacity-40'}`}
            style={{ color: config.accent }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xs font-body">Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>

      {/* Add task footer button */}
      <button
        onClick={onAddTask}
        className="mx-3 mb-3 flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-400
          rounded-lg border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-800/30
          transition-all duration-150 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add a task
      </button>
    </div>
  );
};

export default Column;
