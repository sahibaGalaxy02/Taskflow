import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchBoards } from '../store/slices/boardsSlice';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from '../components/Column';
import AddTaskModal from '../components/AddTaskModal';
import { PageSpinner } from '../components/Spinner';

const STATUSES = ['todo', 'doing', 'done'];

const BoardPage = () => {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: tasks, loading } = useSelector((state) => state.tasks);
  const { items: boards } = useSelector((state) => state.boards);

  const [modal, setModal] = useState(null); // { status, editTask? }
  const board = boards.find((b) => b._id === boardId);

  useEffect(() => {
    dispatch(fetchTasks(boardId));
    if (boards.length === 0) dispatch(fetchBoards());
  }, [boardId, dispatch]);

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  const openAddModal = (status) => setModal({ status });
  const openEditModal = (task) => setModal({ status: task.status, editTask: task });
  const closeModal = () => setModal(null);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Board header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors font-medium">
              Workspace
            </Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-200 font-display font-semibold">
              {board?.title || 'Board'}
            </span>
          </nav>

          {/* Task count */}
          <span className="hidden sm:inline text-xs text-slate-600 font-mono bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <button
          onClick={() => openAddModal('todo')}
          className="btn-primary text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Kanban columns */}
      {loading ? (
        <PageSpinner />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-5 p-5 h-full min-w-max">
              {STATUSES.map((status) => (
                <div key={status} className="w-80 flex-shrink-0 flex flex-col">
                  <Column
                    status={status}
                    tasks={getTasksByStatus(status)}
                    onAddTask={() => openAddModal(status)}
                    onEditTask={openEditModal}
                  />
                </div>
              ))}
            </div>
          </div>
        </DndProvider>
      )}

      {/* Modal */}
      {modal && (
        <AddTaskModal
          boardId={boardId}
          defaultStatus={modal.status}
          editTask={modal.editTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default BoardPage;
