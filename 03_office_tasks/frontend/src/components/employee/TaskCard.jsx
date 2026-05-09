import { useState } from 'react';
import { format } from 'date-fns';
import StatusBadge from '../common/StatusBadge.jsx';
import Modal from '../common/Modal.jsx';
import { tasksAPI } from '../../api/APIs.js';
import toast from 'react-hot-toast';

const REASONS = [
  'Work was not clear',
  'Time was not enough',
  'Technical problem',
  'Waiting for approval',
  'Personal / emergency issue',
];

const TaskCard = ({ task, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [reason, setReason] = useState(task.reason || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (status === 'not_completed' && !reason) {
      toast.error('Please select a reason');
      return;
    }

    try {
      setLoading(true);
      await tasksAPI.updateStatus(task._id, { status, reason: status === 'not_completed' ? reason : '' });
      toast.success('Task updated successfully');
      setModalOpen(false);
      onUpdate?.();
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card-hover p-5 flex flex-col gap-4 animate-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base truncate">{task.title}</h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{task.description}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Assigned by {task.assignedBy?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Reason (if not completed) */}
        {task.reason && (
          <div className="bg-red-400/5 border border-red-400/15 rounded-xl p-3">
            <p className="text-red-400 text-xs font-medium mb-0.5">Reason</p>
            <p className="text-slate-400 text-sm">{task.reason}</p>
          </div>
        )}

        {/* Update button */}
        <button
          onClick={() => { setStatus(task.status); setReason(task.reason || ''); setModalOpen(true); }}
          className="btn-secondary text-sm w-full mt-auto"
        >
          Update Status
        </button>
      </div>

      {/* Update Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Update Task Status">
        <div className="space-y-4">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-3">{task.title}</p>
          </div>

          {/* Status selector */}
          <div>
            <label className="label">Status</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'pending', label: '⏳ Pending', color: 'border-amber-400/30 text-amber-400 bg-amber-400/5' },
                { value: 'completed', label: '✅ Completed', color: 'border-emerald-400/30 text-emerald-400 bg-emerald-400/5' },
                { value: 'not_completed', label: '❌ Not Completed', color: 'border-red-400/30 text-red-400 bg-red-400/5' },
              ].map((s) => (
                <label
                  key={s.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${status === s.value ? s.color : 'border-slate-700/60 text-slate-400 hover:border-slate-600'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={status === s.value}
                    onChange={() => { setStatus(s.value); if (s.value !== 'not_completed') setReason(''); }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${status === s.value ? 'border-current' : 'border-slate-600'}`}>
                    {status === s.value && <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason selector — only when not_completed */}
          {status === 'not_completed' && (
            <div className="animate-in">
              <label className="label">
                Reason <span className="text-red-400">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="" className="bg-slate-800">Select a reason...</option>
                {REASONS.map((r) => (
                  <option key={r} value={r} className="bg-slate-800">{r}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;
