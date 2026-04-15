import { X, Download, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDownloadUrl } from "../../api/docsCollection.js";

const toGoogleDocsUrl = (rawUrl) =>
  `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;

const PDFPreviewModal = ({ pdf, onClose }) => {
  const [useGdocs, setUseGdocs] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!pdf) return null;

  const iframeSrc = useGdocs ? toGoogleDocsUrl(pdf.url) : pdf.url;

  const downloadName = pdf.originalName.endsWith(".pdf")
    ? pdf.originalName
    : `${pdf.originalName}.pdf`;

  const handleReload = () => {
    setLoading(true);
    setError(false);
    setReloadKey((k) => k + 1);
  };

  const handleSwitchMode = () => {
    setUseGdocs((v) => !v);
    setLoading(true);
    setError(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,11,15,0.92)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-5xl h-[90vh] flex flex-col glass-card overflow-hidden animate-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-obsidian-700 flex-shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <p className="font-display font-semibold text-[#e6edf3] truncate text-sm">
              {pdf.originalName}
            </p>
            <p className="text-xs text-obsidian-600 mt-0.5">
              {useGdocs ? "Google Docs Viewer" : "Direct preview"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSwitchMode}
              title={useGdocs ? "Try direct preview" : "Use Google Docs Viewer"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-obsidian-700 hover:bg-obsidian-600 text-obsidian-600 hover:text-[#e6edf3]
                border border-obsidian-600 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {useGdocs ? "Direct" : "GDocs"}
            </button>

            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-obsidian-700 hover:bg-obsidian-600 text-[#e6edf3]
                border border-obsidian-600 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </a>

            {/* Download via proxy — gets correct .pdf filename */}
            <a
              href={getDownloadUrl(pdf._id)}
              download={downloadName}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-amber-400/10 hover:bg-amber-400/20 text-amber-400
                border border-amber-400/20 hover:border-amber-400/40 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-obsidian-600 hover:text-[#e6edf3] hover:bg-obsidian-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="relative flex-1 bg-obsidian-950 overflow-hidden">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <div className="w-8 h-8 border-2 border-obsidian-600 border-t-amber-400 rounded-full animate-spin" />
              <p className="text-sm text-obsidian-600">Loading preview…</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-8">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-display font-semibold text-[#e6edf3]">Preview unavailable</p>
                <p className="text-sm text-obsidian-600 max-w-xs">
                  The browser blocked inline rendering. Open or download the file using the buttons above.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    bg-obsidian-700 hover:bg-obsidian-600 text-[#e6edf3] border border-obsidian-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <button
                  onClick={handleSwitchMode}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/20 transition-all"
                >
                  Switch to {useGdocs ? "direct" : "Google Docs"} viewer
                </button>
              </div>
            </div>
          )}

          <iframe
            key={`${reloadKey}-${iframeSrc}`}
            src={iframeSrc}
            title={pdf.originalName}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              loading || error ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;