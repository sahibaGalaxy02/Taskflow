import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, createBoard } from '../store/slices/boardsSlice';
import BoardCard from '../components/BoardCard';
import { PageSpinner } from '../components/Spinner';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: boards, loading } = useSelector((state) => state.boards);
  const { user } = useSelector((state) => state.auth);

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return toast.error('Board name is required');
    setCreating(true);
    const res = await dispatch(createBoard({ title: newTitle.trim() }));
    setCreating(false);
    if (createBoard.fulfilled.match(res)) {
      toast.success('Board created!');
      setNewTitle('');
      setShowCreate(false);
    } else {
      toast.error(res.payload || 'Failed to create board');
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm text-indigo-400 font-mono mb-1">{greeting()},</p>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white">
            {user?.name?.split(' ')[0]}'s Workspace
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {boards.length} board{boards.length !== 1 ? 's' : ''} · {boards.reduce((a, b) => a + (b.taskCount || 0), 0)} tasks total
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary py-2.5 px-5 text-sm self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Board
        </button>
      </div>

      {/* Create board modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm glass-panel p-6 shadow-2xl shadow-black/50 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display font-bold text-lg text-slate-100 mb-5">Create Board</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Marketing Campaign, Sprint #12…"
                className="input-field"
                required
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 justify-center">
                  {creating ? <Spinner size="sm" /> : null}
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Board grid */}
      {loading ? (
        <PageSpinner />
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-6 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-xl text-slate-300 mb-2">No boards yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs">
            Create your first board to start organizing tasks with a beautiful Kanban view.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard key={board._id} board={board} />
          ))}
          {/* Add board card */}
          <button
            onClick={() => setShowCreate(true)}
            className="card border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-400 text-sm font-medium transition-all duration-200 min-h-[120px] group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Board
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
