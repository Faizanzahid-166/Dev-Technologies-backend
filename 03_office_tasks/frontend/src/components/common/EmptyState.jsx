const EmptyState = ({ title = 'Nothing here yet', message = '', icon }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mb-4 text-3xl">
      {icon || '📋'}
    </div>
    <h3 className="text-slate-300 font-semibold text-lg">{title}</h3>
    {message && <p className="text-slate-500 text-sm mt-1.5 max-w-xs">{message}</p>}
  </div>
);

export default EmptyState;
