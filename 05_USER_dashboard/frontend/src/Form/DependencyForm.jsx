import { useState, useEffect } from 'react';
import { Modal, Spinner } from '../components/UI.jsx';

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

const empty = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' };

export default function DependencyForm({ isOpen, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    } else {
      setForm(empty);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.dueDate) delete payload.dueDate;
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Dependency' : 'New Dependency'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input"
            placeholder="Dependency title"
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input resize-none"
            rows={3}
            placeholder="Optional details..."
            maxLength={1000}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input">
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Due Date</label>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <><Spinner size="sm" />{initialData ? 'Saving...' : 'Creating...'}</> : initialData ? 'Save changes' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}