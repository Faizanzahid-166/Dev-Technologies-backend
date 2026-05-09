import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import CreateTaskForm from '../components/admin/CreateTaskForm.jsx';

const CreateTaskPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800/60"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Task</h1>
            <p className="text-slate-500 mt-0.5">Assign a task to an employee.</p>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card p-6">
          <CreateTaskForm onCreated={() => navigate('/admin/tasks')} />
        </div>

        {/* Tips */}
        <div className="glass-card p-5">
          <h3 className="text-slate-300 font-semibold text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Task Tips
          </h3>
          <ul className="space-y-1.5 text-slate-500 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Be specific with the task title so employees understand it at a glance.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Provide detailed descriptions including any relevant links or requirements.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Setting a due date helps employees prioritize their workload effectively.
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTaskPage;
