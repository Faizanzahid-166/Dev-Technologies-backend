import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDependencies,
  createDependency,
  updateDependency,
  deleteDependency,
  setFilters,
} from '../redux/dependenciesSliceTunk/dependenciesSlice.js';
import { StatusBadge, PriorityBadge, EmptyState, Skeleton, Modal } from '../components/UI.jsx';
import DependencyForm from '../Form/DependencyForm.jsx';
import {
  Plus, GitBranch, Pencil, Trash2, ChevronLeft, ChevronRight,
  Calendar, Filter, RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DepRow = ({ dep, onEdit, onDelete }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-ink-800/30 hover:bg-ink-800/50 border border-transparent hover:border-ink-700/50 transition-all group animate-fade-in">
    <div className="flex-1 min-w-0">
      <div className="flex items-start gap-2 flex-wrap">
        <p className="text-sm font-500 text-ink-100">{dep.title}</p>
        <PriorityBadge priority={dep.priority} />
      </div>
      {dep.description && (
        <p className="text-xs text-ink-500 mt-1 line-clamp-2">{dep.description}</p>
      )}
      <div className="flex items-center gap-3 mt-2">
        <StatusBadge status={dep.status} />
        {dep.dueDate && (
          <span className="flex items-center gap-1 text-xs text-ink-600 font-mono">
            <Calendar size={11} />
            {new Date(dep.dueDate).toLocaleDateString()}
          </span>
        )}
        <span className="text-xs text-ink-700 font-mono ml-auto">
          {new Date(dep.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button onClick={() => onEdit(dep)} className="btn-ghost p-2">
        <Pencil size={14} />
      </button>
      <button onClick={() => onDelete(dep)} className="btn-danger p-2">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

export default function DependenciesPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading, actionLoading, filters } = useSelector((s) => s.dependencies);

  const [showForm, setShowForm] = useState(false);
  const [editDep, setEditDep] = useState(null);
  const [deleteDep, setDeleteDep] = useState(null);

  const load = (overrides = {}) => {
    const params = { ...filters, ...overrides };
    if (!params.status) delete params.status;
    if (!params.priority) delete params.priority;
    dispatch(fetchDependencies(params));
  };

  useEffect(() => { load(); }, [filters]);

  const handleCreate = async (data) => {
    const res = await dispatch(createDependency(data));
    if (createDependency.fulfilled.match(res)) {
      toast.success('Dependency created!');
      setShowForm(false);
    } else {
      toast.error(res.payload || 'Failed to create');
    }
  };

  const handleUpdate = async (data) => {
    const res = await dispatch(updateDependency({ id: editDep._id, data }));
    if (updateDependency.fulfilled.match(res)) {
      toast.success('Dependency updated!');
      setEditDep(null);
    } else {
      toast.error(res.payload || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteDependency(deleteDep._id));
    if (deleteDependency.fulfilled.match(res)) {
      toast.success('Dependency deleted');
      setDeleteDep(null);
    } else {
      toast.error(res.payload || 'Failed to delete');
    }
  };

  const setFilter = (key, val) => {
    dispatch(setFilters({ [key]: val, page: 1 }));
  };

  const hasFilters = filters.status || filters.priority;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title mb-1">Dependencies</h1>
          <p className="text-sm text-ink-500">
            {pagination ? `${pagination.total} total` : 'Manage your tasks & projects'}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} />
          New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 text-ink-500">
          <Filter size={14} />
          <span className="text-xs font-display font-600 uppercase tracking-wider">Filter</span>
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          className="input !py-1.5 !text-xs w-auto min-w-[130px]"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value)}
          className="input !py-1.5 !text-xs w-auto min-w-[130px]"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => dispatch(setFilters({ status: '', priority: '', page: 1 }))}
            className="btn-ghost !py-1.5 text-xs"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2 min-h-[200px]">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)
        ) : items.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title="No dependencies found"
            description={hasFilters ? 'Try clearing your filters.' : 'Create your first dependency to get started.'}
            action={
              !hasFilters && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  <Plus size={15} /> Create dependency
                </button>
              )
            }
          />
        ) : (
          items.map((dep) => (
            <DepRow
              key={dep._id}
              dep={dep}
              onEdit={setEditDep}
              onDelete={setDeleteDep}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-800">
          <span className="text-xs text-ink-500 font-mono">
            Page {pagination.page} / {pagination.pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
              disabled={pagination.page <= 1}
              className="btn-secondary !py-1.5 !px-3"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
              disabled={pagination.page >= pagination.pages}
              className="btn-secondary !py-1.5 !px-3"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      <DependencyForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        loading={actionLoading}
      />

      {/* Edit Form */}
      <DependencyForm
        isOpen={!!editDep}
        onClose={() => setEditDep(null)}
        onSubmit={handleUpdate}
        initialData={editDep}
        loading={actionLoading}
      />

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteDep} onClose={() => setDeleteDep(null)} title="Delete Dependency" size="sm">
        <p className="text-sm text-ink-400 mb-1">
          Are you sure you want to delete:
        </p>
        <p className="text-sm font-500 text-ink-100 mb-6 p-3 bg-ink-800/60 rounded-xl">
          "{deleteDep?.title}"
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteDep(null)} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-600 font-display transition-all active:scale-95 disabled:opacity-50"
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}