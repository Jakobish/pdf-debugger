"use client";
import { usePostHog } from "posthog-js/react";

import { DropzoneScreen } from "@/app/_components/dropzone-screen";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { PdfViewerScreen } from "@/app/_components/pdf-viewer-screen";
import { loadPdfExample } from "@/lib/load-pdf-example";
import { loadPDFDocument } from "@/lib/load-pdf-hook";
import { usePDFDebuggerStore } from "@/state";

export function SourceViewer() {
  const store = usePDFDebuggerStore();
  const posthog = usePostHog();

  const loadPDF = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(bytes);
    const pdf = loadPDFDocument(pdfBytes);
    store.onPDFLoad({
      pdfBytes: pdfBytes,
      pdfName: file.name,
      pdfDocument: pdf,
      isExample: false,
    });
  };

  const onPDFDrop = (file: File) => {
    store.onPDFDrop(file);
    posthog.capture("pdf_dropped", {
      file_name: file.name,
      file_size: file.size,
    });
    loadPDF(file);
  };

  const onExamplePDFDrop = async () => {
    store.onExampleClick();
    const pdfBytes = await loadPdfExample();
    const pdf = loadPDFDocument(pdfBytes);
    store.onPDFLoad({
      pdfBytes: pdfBytes,
      pdfName: "example.pdf",
      pdfDocument: pdf,
      isExample: true,
    });
  };

  const onHeaderClick = () => {
    store.reset();
  };

  return (
    <main className="relative min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted/20 bg-grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 p-6 gap-6 flex flex-col h-[100dvh] max-h-[100dvh]">
        <Header
          onClick={onHeaderClick}
          showHomeButton={store.screen !== "dropzone"}
        />
        <div className="flex-1 flex overflow-hidden">
          {store.screen === "dropzone" && (
            <DropzoneScreen onDrop={onPDFDrop} onExample={onExamplePDFDrop} />
          )}
          {store.screen === "loading" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-lg text-muted-foreground">
                  Processing PDF...
                </p>
              </div>
            </div>
          )}
          {store.screen === "pdf" && store.pdfDocument && store.pdfName && (
            <PdfViewerScreen pdf={store.pdfDocument} name={store.pdfName} />
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}
