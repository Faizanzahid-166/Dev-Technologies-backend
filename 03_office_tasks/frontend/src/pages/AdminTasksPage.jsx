import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TaskTable from '../components/admin/TaskTable.jsx';
import SearchFilterBar from '../components/common/SearchFilterBar.jsx';
import { tasksAPI } from '../api/APIs.js';
import toast from 'react-hot-toast';

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const LIMIT = 15;

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await tasksAPI.getAll({ search, status, page, limit: LIMIT });
      setTasks(data.tasks);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  useEffect(() => {
    const delay = setTimeout(fetchTasks, 300);
    return () => clearTimeout(delay);
  }, [fetchTasks]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">All Tasks</h1>
          <p className="text-slate-500 mt-1">Monitor and manage all workspace tasks.</p>
        </div>

        {/* Table card */}
        <div className="glass-card">
          <div className="p-5 border-b border-slate-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-medium">
                Showing <span className="text-white font-semibold">{tasks.length}</span> of{' '}
                <span className="text-white font-semibold">{total}</span> tasks
              </p>
              <button
                onClick={fetchTasks}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <SearchFilterBar search={search} onSearch={setSearch} status={status} onStatus={setStatus} />
          </div>

          <TaskTable tasks={tasks} loading={loading} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="px-5 py-4 border-t border-slate-800/60 flex items-center justify-between">
              <p className="text-slate-500 text-sm">
                Page {page} of {pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm px-3 py-2 disabled:opacity-40"
                >
                  ← Prev
                </button>
                {[...Array(Math.min(pages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                        ${page === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="btn-secondary text-sm px-3 py-2 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTasksPage;
