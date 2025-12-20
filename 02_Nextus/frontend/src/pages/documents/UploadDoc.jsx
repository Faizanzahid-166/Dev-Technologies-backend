import { useState } from "react";
import { uploadDocument, addSignature } from "../../api/documentApi.js";
import { useAuth } from "../../context/Authcontext";

function UploadDoc() {
  const { token } = useAuth(); // JWT token or null if using cookie session
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload document
  const handleUpload = async () => {
    if (!selectedFile) return setMessage("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", selectedFile); // Must match backend 'file'

    try {
      setUploading(true);
      setMessage("");
      const res = await uploadDocument(formData, token);
      setMessage(`Uploaded: ${res.data.document.name}`);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Make sure you are logged in.");
    } finally {
      setUploading(false);
    }
  };

  // Optional: Add signature
  const handleSignatureUpload = async (docId, signatureFile) => {
    if (!signatureFile) return;

    const formData = new FormData();
    formData.append("signature", signatureFile); // Must match backend 'signature'

    try {
      const res = await addSignature(docId, formData, token);
      console.log("Signature added:", res.data);
    } catch (err) {
      console.error("Signature upload failed", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Document</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <input
        type="file"
        onChange={handleFileChange}
        className="block mb-4 w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Document"}
      </button>
    </div>
  );
}

export default UploadDoc;
