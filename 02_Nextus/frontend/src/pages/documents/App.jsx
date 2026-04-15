import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Vault, RefreshCw } from "lucide-react";
import UploadZone from "./components/UploadZone.jsx";
import PDFList from "./components/PDFList.jsx";
import PDFPreviewModal from "./components/PDFPreviewModal.jsx";
import { usePDFs } from "./hooks/usePDFs.js";
import Health from "./pages/Health.jsx";


export default function App() {
  const { pdfs, loading, uploading, uploadProgress, error, handleUpload, handleDelete, reload } = usePDFs();
  const [previewPDF, setPreviewPDF] = useState(null);

  return (
    <div className="min-h-screen bg-obsidian-950">
      <Health /> 
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full
        bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20
              flex items-center justify-center glow-amber">
              <Vault className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="font-display font-bold text-4xl tracking-tight text-[#e6edf3]">
              PDF<span className="text-amber-400">Vault</span>
            </h1>
          </div>
          <p className="text-obsidian-600 font-body max-w-md mx-auto">
            Upload, store and preview your PDF documents — fast, clean, and always accessible.
          </p>
        </header>

        {/* Upload Section */}
        <section className="glass-card p-6 space-y-2">
          <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-obsidian-600 mb-4">
            Upload
          </h2>
          <UploadZone onUpload={handleUpload} uploading={uploading} progress={uploadProgress} />
        </section>

        {/* Library Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-[#e6edf3]">
                Your Library
              </h2>
              {!loading && (
                <p className="text-xs text-obsidian-600 mt-0.5">
                  {pdfs.length} document{pdfs.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <button
              onClick={reload}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-obsidian-800 hover:bg-obsidian-700 text-obsidian-600 hover:text-[#e6edf3]
                border border-obsidian-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <PDFList
            pdfs={pdfs}
            loading={loading}
            error={error}
            onPreview={setPreviewPDF}
            onDelete={handleDelete}
            onReload={reload}
          />
        </section>
      </div>

      {/* Preview Modal */}
      {previewPDF && (
        <PDFPreviewModal pdf={previewPDF} onClose={() => setPreviewPDF(null)} />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#161b22",
            color: "#e6edf3",
            border: "1px solid #30363d",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#fbbf24", secondary: "#161b22" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#161b22" } },
        }}
      />
    </div>
  );
}