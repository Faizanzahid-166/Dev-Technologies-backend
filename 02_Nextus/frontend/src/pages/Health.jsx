import { useEffect, useState } from "react";
import {checkHealth} from "../api/docsCollection.js";

export default function Health() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
       const res = await checkHealth();

        if (res.success) {   // ✅ FIXED
          console.log("⚡ MERN Connected Successfully!");
          setConnected(true);
        }
      } catch (err) {
        console.log("❌ Backend not connected");
      }
    };

    checkConnection();
  }, []);

  return (
    <div>
      {connected}
    </div>
  );
}