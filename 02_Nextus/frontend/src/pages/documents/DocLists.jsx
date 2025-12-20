import { useEffect, useState } from "react";
import { getMyDocuments, downloadDocument } from "../../api/documentApi.js";

function MyDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const res = await getMyDocuments();
        setDocs(res.data);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleDownload = async (docId, name) => {
    try {
      setDownloadingId(docId);
      const res = await downloadDocument(docId);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || "file.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-3xl p-20  bg-gray-50 rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Documents</h2>

      {loading ? (
        <p className="text-gray-600">Loading documents...</p>
      ) : docs.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {docs.map((d) => (
            <li
              key={d._id}
              className="w-5/5 mx-[4rem] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-gray-700 font-medium">{d.name}</span>
              <button
                onClick={() => handleDownload(d._id, d.name)}
                disabled={downloadingId === d._id}
                className={`px-4 py-2 rounded-md text-white font-semibold transition-colors ${
                  downloadingId === d._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {downloadingId === d._id ? "Downloading..." : "Download"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyDocs;
