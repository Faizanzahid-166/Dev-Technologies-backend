import { format } from 'date-fns';
import StatusBadge from '../common/StatusBadge.jsx';
import { SkeletonRow } from '../common/Skeleton.jsx';
import EmptyState from '../common/EmptyState.jsx';

const TaskTable = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/60">
              <th className="table-header">Task</th>
              <th className="table-header">Assigned To</th>
              <th className="table-header">Assigned By</th>
              <th className="table-header">Status</th>
              <th className="table-header">Reason</th>
              <th className="table-header">Date</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState title="No tasks found" message="Create a new task or adjust your filters." icon="📋" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800/60">
            <th className="table-header">Task</th>
            <th className="table-header">Assigned To</th>
            <th className="table-header">Assigned By</th>
            <th className="table-header">Status</th>
            <th className="table-header">Reason</th>
            <th className="table-header">Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="table-row">
              {/* Task */}
              <td className="table-cell max-w-xs">
                <p className="font-medium text-slate-200 truncate">{task.title}</p>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{task.description}</p>
              </td>

              {/* Assigned To */}
              <td className="table-cell">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                    {task.assignedTo?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium text-sm">{task.assignedTo?.name}</p>
                    <p className="text-slate-500 text-xs">{task.assignedTo?.email}</p>
                  </div>
                </div>
              </td>

              {/* Assigned By */}
              <td className="table-cell">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                    {task.assignedBy?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <p className="text-slate-400 text-sm">{task.assignedBy?.name}</p>
                </div>
              </td>

              {/* Status */}
              <td className="table-cell">
                <StatusBadge status={task.status} />
              </td>

              {/* Reason */}
              <td className="table-cell max-w-[180px]">
                {task.reason ? (
                  <span className="text-red-400/80 text-xs bg-red-400/5 border border-red-400/10 rounded-lg px-2 py-1 line-clamp-2">
                    {task.reason}
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs">—</span>
                )}
              </td>

              {/* Date */}
              <td className="table-cell whitespace-nowrap">
                <p className="text-slate-400 text-sm">{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                <p className="text-slate-600 text-xs">{format(new Date(task.createdAt), 'h:mm a')}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
