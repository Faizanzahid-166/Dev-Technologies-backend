// src/documents/Pdfviewer.jsx
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Import the worker from pdfjs-dist
import * as pdfjs from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

// Set the workerSrc manually
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function DocumentPreview({ fileUrl }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ height: "750px" }}>
      <Worker workerUrl={pdfWorker}>
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
}
