declare module "pdfjs-dist/build/pdf.mjs" {
  export * from "pdfjs-dist";
}

declare module "pdfjs-dist/build/pdf.worker.mjs" {
  const workerSrc: string;
  export default workerSrc;
}

declare module "pdfjs-dist/build/pdf.worker.min.js?url" {
  const workerSrc: string;
  export default workerSrc;
}

declare module "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url" {
  const workerSrc: string;
  export default workerSrc;
}