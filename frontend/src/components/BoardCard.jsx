import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteBoard } from '../store/slices/boardsSlice';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';

const BoardCard = ({ board }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${board.title}" and all its tasks?`)) return;
    const res = await dispatch(deleteBoard(board._id));
    if (deleteBoard.fulfilled.match(res)) {
      toast.success('Board deleted');
    } else {
      toast.error(res.payload || 'Failed to delete board');
    }
  };

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className="group relative card hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 overflow-hidden animate-fade-in"
    >
      {/* Color accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${board.color}, ${board.color}88)` }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
              style={{ background: `${board.color}22`, border: `1px solid ${board.color}44` }}
            >
              <span style={{ color: board.color }}>{board.title.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className="font-display font-semibold text-slate-100 text-base leading-tight group-hover:text-white transition-colors">
              {board.title}
            </h3>
          </div>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 flex-shrink-0"
            title="Delete board"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{board.taskCount ?? 0} task{board.taskCount !== 1 ? 's' : ''}</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">{formatDate(board.createdAt)}</span>
        </div>

        {/* Arrow hint */}
        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
