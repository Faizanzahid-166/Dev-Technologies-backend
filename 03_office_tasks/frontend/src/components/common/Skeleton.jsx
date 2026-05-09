export const SkeletonRow = () => (
  <tr className="border-b border-slate-800/60">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 rounded-lg shimmer" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

export const SkeletonCard = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="h-4 rounded-lg shimmer w-3/4" />
    <div className="h-3 rounded-lg shimmer w-full" />
    <div className="h-3 rounded-lg shimmer w-2/3" />
    <div className="flex gap-2 pt-1">
      <div className="h-6 w-20 rounded-full shimmer" />
      <div className="h-6 w-16 rounded-full shimmer" />
    </div>
  </div>
);

export const SkeletonStat = () => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl shimmer flex-shrink-0" />
    <div className="space-y-2 flex-1">
      <div className="h-3 rounded shimmer w-24" />
      <div className="h-7 rounded shimmer w-16" />
    </div>
  </div>
);
