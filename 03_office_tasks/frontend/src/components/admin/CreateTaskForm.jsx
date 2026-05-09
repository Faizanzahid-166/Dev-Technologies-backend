import { useState, useEffect } from 'react';
import { tasksAPI, usersAPI } from '../../api/APIs.js';
import toast from 'react-hot-toast';

const CreateTaskForm = ({ onCreated }) => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await usersAPI.getEmployees();
        setEmployees(data.employees);
      } catch {
        toast.error('Failed to load employees');
      } finally {
        setFetchingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.assignedTo) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await tasksAPI.create(form);
      toast.success('Task created successfully! 🎉');
      setForm({ title: '', description: '', assignedTo: '', dueDate: '' });
      onCreated?.();
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="label">
          Task Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Complete Q4 report"
          className="input-field"
          maxLength={100}
        />
        <p className="text-slate-600 text-xs mt-1.5">{form.title.length}/100 characters</p>
      </div>

      {/* Description */}
      <div>
        <label className="label">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task in detail..."
          rows={4}
          maxLength={500}
          className="input-field resize-none"
        />
        <p className="text-slate-600 text-xs mt-1.5">{form.description.length}/500 characters</p>
      </div>

      {/* Assign to */}
      <div>
        <label className="label">
          Assign To <span className="text-red-400">*</span>
        </label>
        {fetchingEmployees ? (
          <div className="input-field flex items-center gap-2 text-slate-500">
            <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div className="input-field text-slate-500">No employees found. Register employees first.</div>
        ) : (
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="input-field cursor-pointer"
          >
            <option value="" className="bg-slate-800">Select an employee...</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id} className="bg-slate-800">
                {emp.name} — {emp.email}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Due Date (optional) */}
      <div>
        <label className="label">Due Date <span className="text-slate-600">(optional)</span></label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="input-field"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <button
        type="submit"
        disabled={loading || fetchingEmployees}
        className="btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Creating Task...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </span>
        )}
      </button>
    </form>
  );
};

export default CreateTaskForm;
