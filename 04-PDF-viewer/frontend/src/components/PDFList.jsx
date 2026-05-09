import { FileX, RefreshCw } from "lucide-react";
import PDFCard from "./PDFCard.jsx";

const SkeletonCard = () => (
  <div className="glass-card p-5 flex flex-col gap-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-obsidian-700 shimmer-bg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded bg-obsidian-700 shimmer-bg w-3/4" />
        <div className="h-3 rounded bg-obsidian-700 shimmer-bg w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 h-9 rounded-lg bg-obsidian-700 shimmer-bg" />
      <div className="w-10 h-9 rounded-lg bg-obsidian-700 shimmer-bg" />
      <div className="w-10 h-9 rounded-lg bg-obsidian-700 shimmer-bg" />
    </div>
  </div>
);

const PDFList = ({ pdfs, loading, error, onPreview, onDelete, onReload }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={onReload}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg
            bg-obsidian-700 hover:bg-obsidian-600 text-[#e6edf3] text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-obsidian-800 flex items-center justify-center">
          <FileX className="w-7 h-7 text-obsidian-600" />
        </div>
        <p className="font-display font-semibold text-[#e6edf3]">No PDFs yet</p>
        <p className="text-sm text-obsidian-600">Upload your first PDF above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pdfs.map((pdf) => (
        <PDFCard
          key={pdf._id}
          pdf={pdf}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PDFList;