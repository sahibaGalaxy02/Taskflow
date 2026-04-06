import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../store/slices/tasksSlice';
import { formatDate, isOverdue, getPriorityConfig } from '../utils/helpers';
import toast from 'react-hot-toast';

const ITEM_TYPE = 'TASK';

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(ref);

  const handleDelete = async (e) => {
    e.stopPropagation();
    const res = await dispatch(deleteTask(task._id));
    if (deleteTask.fulfilled.match(res)) {
      toast.success('Task deleted');
    } else {
      toast.error(res.payload || 'Failed to delete');
    }
  };

  const overdue = isOverdue(task.dueDate) && task.status !== 'done';
  const priority = getPriorityConfig(task.priority);

  return (
    <div
      ref={ref}
      onClick={() => onEdit(task)}
      className={`group relative bg-slate-800/60 border rounded-xl p-4 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:bg-slate-800 hover:border-slate-600 hover:shadow-lg hover:shadow-black/20
        ${isDragging ? 'opacity-40 rotate-1 scale-95' : 'opacity-100'}
        ${overdue ? 'border-red-500/30 hover:border-red-500/50' : 'border-slate-700/60'}
      `}
    >
      {/* Priority dot + delete */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium font-mono
          ${priority.bg} ${priority.color} ${priority.border}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {priority.label}
        </span>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h4 className="font-display font-semibold text-slate-100 text-sm leading-snug mb-1.5 group-hover:text-white transition-colors">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {task.dueDate ? (
          <div className={`flex items-center gap-1 text-xs font-mono ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
            {overdue && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(task.dueDate)}
          </div>
        ) : (
          <span />
        )}

        {/* Drag handle icon */}
        <div className="opacity-0 group-hover:opacity-40 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>

      {/* Overdue indicator bar */}
      {overdue && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl bg-red-500" />
      )}
    </div>
  );
};

export default TaskCard;
