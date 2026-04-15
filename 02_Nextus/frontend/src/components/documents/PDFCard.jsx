import { useState } from "react";
import { Eye, Download, Trash2, FileText, Calendar, HardDrive } from "lucide-react";
import { getDownloadUrl } from "../../api/docsCollection.js";


const PDFCard = ({ pdf, onPreview, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${pdf.originalName}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(pdf._id);
    } finally {
      setDeleting(false);
    }
  };

  // Ensure the download filename always has .pdf extension
  const downloadName = pdf.originalName.endsWith(".pdf")
    ? pdf.originalName
    : `${pdf.originalName}.pdf`;

  return (
    <div className="glass-card p-5 flex flex-col gap-4 group hover:border-obsidian-500 hover:shadow-lg transition-all duration-200 animate-fade-up">
      {/* File info */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-[#e6edf3] text-sm leading-tight truncate" title={pdf.originalName}>
            {pdf.originalName}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            <span className="flex items-center gap-1 font-mono text-xs text-obsidian-600">
              <HardDrive className="w-3 h-3" />
              {formatSize(pdf.size)}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-obsidian-600">
              <Calendar className="w-3 h-3" />
              {formatDate(pdf.uploadedAt || pdf.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Preview */}
        <button
          onClick={() => onPreview(pdf)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
            bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-sm font-medium
            border border-amber-400/20 hover:border-amber-400/40 transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        {/* Download — uses our backend proxy so the file arrives as filename.pdf */}
        <a
          href={getDownloadUrl(pdf._id)}
          download={downloadName}
          title="Download"
          className="flex items-center justify-center px-3 py-2 rounded-lg
            bg-obsidian-700 hover:bg-obsidian-600 text-[#e6edf3]
            border border-obsidian-600 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
        </a>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
          className="flex items-center justify-center px-3 py-2 rounded-lg
            bg-obsidian-700 hover:bg-red-500/20 text-obsidian-600 hover:text-red-400
            border border-obsidian-600 hover:border-red-500/30 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <div className="w-4 h-4 border-2 border-obsidian-600 border-t-red-400 rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PDFCard;