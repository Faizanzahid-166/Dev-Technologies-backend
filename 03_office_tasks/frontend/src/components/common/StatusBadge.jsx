const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
    dot: 'bg-amber-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  not_completed: {
    label: 'Not Completed',
    className: 'bg-red-400/10 text-red-400 border border-red-400/20',
    dot: 'bg-red-400',
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`status-badge ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
