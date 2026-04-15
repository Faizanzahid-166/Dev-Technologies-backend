import { useRef, useState, useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";

const UploadZone = ({ onUpload, uploading, progress }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const validateAndUpload = useCallback(
    (file) => {
      setFileError("");
      if (!file) return;
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are accepted.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setFileError("File exceeds the 20MB limit.");
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      validateAndUpload(file);
    },
    [validateAndUpload]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleChange = (e) => {
    validateAndUpload(e.target.files?.[0]);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative w-full cursor-pointer select-none rounded-xl border-2 border-dashed
          transition-all duration-300 p-10 text-center group
          ${dragging
            ? "border-amber-400 bg-amber-400/5 scale-[1.01]"
            : "border-obsidian-600 hover:border-amber-400/60 hover:bg-obsidian-800/30"
          }
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />

        {/* Icon */}
        <div className={`
          mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${dragging ? "bg-amber-400/20 text-amber-400" : "bg-obsidian-700 text-obsidian-600 group-hover:bg-amber-400/10 group-hover:text-amber-400"}
        `}>
          {uploading ? (
            <FileText className="w-7 h-7 animate-bounce" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>

        {uploading ? (
          <div className="space-y-3">
            <p className="font-display font-semibold text-amber-400 text-lg">
              Uploading…
            </p>
            <div className="mx-auto max-w-xs">
              <div className="h-1.5 w-full rounded-full bg-obsidian-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-sm text-obsidian-600">
                {progress}%
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="font-display font-semibold text-[#e6edf3] text-lg mb-1">
              Drop your PDF here
            </p>
            <p className="text-sm text-obsidian-600">
              or{" "}
              <span className="text-amber-400 font-medium">click to browse</span>
            </p>
            <p className="mt-3 font-mono text-xs text-obsidian-600">
              PDF only · Max 20MB
            </p>
          </>
        )}
      </div>

      {fileError && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{fileError}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;