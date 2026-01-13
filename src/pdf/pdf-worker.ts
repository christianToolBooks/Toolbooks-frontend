"use client";

import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// Usa la versión UMD, NO la ESM
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";