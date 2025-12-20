import { useState } from "react";
import { addSignature } from "../../api/documentApi";

export default function AddSignature({ docId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSign = async () => {
    if (!file) return alert("Select signature file!");
    const formData = new FormData();
    formData.append("signature", file);

    try {
      const res = await addSignature(docId, formData);
      setMessage(res.data.message);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSign}>Sign Document</button>
      {message && <p>{message}</p>}
    </div>
  );
}
