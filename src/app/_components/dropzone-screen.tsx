"use client";
import { FileUp, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

import { cn } from "@/lib/utils";

function Dropzone(props: { onDrop: (file: File) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);
      setIsLoading(true);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some((err) => err.code === "file-too-large")) {
          setError("File is too large. Max 50MB allowed.");
        } else if (
          rejection.errors.some((err) => err.code === "file-invalid-type")
        ) {
          setError("Invalid file type. Only PDF files are allowed.");
        } else {
          setError("File rejected. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (acceptedFiles.length > 0) {
        const file: File = acceptedFiles[0];
        try {
          props.onDrop(file);
        } catch (e) {
          setError("Failed to process PDF. Please try another file.");
          setIsLoading(false);
        }
      } else {
        setError("No file selected.");
        setIsLoading(false);
      }
    },
    [props],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50 MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass-effect border-2 border-dashed transition-all duration-500 cursor-pointer sm:w-1/2 p-12 flex flex-col justify-center items-center gap-6",
        isLoading
          ? "border-blue-500 animate-pulse"
          : error
            ? "border-red-500"
            : "border-primary/30 hover:border-primary/60 hover:scale-[1.02] animate-glow",
      )}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-semibold text-foreground">
            Loading PDF...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <FileUp className="h-16 w-16 text-red-500" />
          <p className="text-lg font-semibold text-red-500">Error</p>
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-muted-foreground">Click to try again</p>
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            <FileUp className="relative h-16 w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Drop your PDF here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </>
      )}
    </div>
  );
}

function ExampleButton(props: { onExample: () => void }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl glass-effect border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-all duration-500 cursor-pointer sm:w-1/2 p-12 flex flex-col justify-center items-center gap-6 hover:scale-[1.02]"
      onClick={props.onExample}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
        <Sparkles className="relative h-16 w-16 text-muted-foreground group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground">Try Example</p>
        <p className="text-sm text-muted-foreground">Explore with sample PDF</p>
      </div>
    </div>
  );
}

export function DropzoneScreen(props: {
  onDrop: (file: File) => void;
  onExample: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12 overflow-y-auto px-4">
      <div className="text-center space-y-6 max-w-3xl animate-gentle-float">
        <h2 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
          Inspect PDF Structure
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Dive deep into the internal structure of PDF files. Explore objects,
          streams, dictionaries, and references with our powerful debugging
          tool.
        </p>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-subtle-pulse" />
            <p className="font-semibold text-green-800 dark:text-green-200 text-sm">
              🔒 Complete Privacy Protection
            </p>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Your PDF files are processed entirely in your browser. No uploads,
            no servers, no data transmission.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-subtle-pulse" />
            Client-side processing
          </div>
          <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-subtle-pulse" />
            No file uploads
          </div>
          <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-subtle-pulse" />
            Real-time analysis
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-8 w-full max-w-4xl">
        <Dropzone onDrop={props.onDrop} />
        <ExampleButton onExample={props.onExample} />
      </div>
    </div>
  );
}
