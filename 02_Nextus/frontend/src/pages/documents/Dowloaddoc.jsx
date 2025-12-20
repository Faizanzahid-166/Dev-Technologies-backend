// src/pages/Documents/Download.jsx
import React, { useEffect, useState } from "react";
import { getMyDocuments } from "../../api/documentApi";
import api from "../../api/axiosConfig"; // adjust the path

const Download = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await getMyDocuments();
        setDocuments(res.data || []); // safety check
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = async (doc) => {
    if (!doc?._id) {
      console.error("❌ Invalid document object:", doc);
      return;
    }

    try {
      const res = await api.get(`/documents/${doc._id}/download`, {
        withCredentials: true,
      });

      if (res.data?.fileUrl) {
        window.open(res.data.fileUrl, "_blank"); // open Cloudinary file
      } else {
        console.error("❌ No fileUrl returned from server:", res.data);
      }
    } catch (err) {
      console.error("❌ Download failed", err);
    }
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Documents</h2>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="p-4 border rounded shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-gray-600">
                  Status: {doc.status} | Version: {doc.currentVersion}
                </p>
              </div>
              <button
                onClick={() => handleDownload(doc)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Download;
