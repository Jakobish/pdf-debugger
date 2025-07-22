"use client";
import { FileUp, Sparkles } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";

function Dropzone(props: { onDrop: (file: File) => void }) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file: File = acceptedFiles[0];
      props.onDrop(file);
    },
    [props],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="group relative overflow-hidden rounded-2xl glass-effect border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-500 cursor-pointer sm:w-1/2 p-12 flex flex-col justify-center items-center gap-6 hover:scale-[1.02] animate-glow"
    >
      <input {...getInputProps()} />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
        <FileUp className="relative h-16 w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground">Drop your PDF here</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </div>
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
          Dive deep into the internal structure of PDF files. Explore objects, streams, 
          dictionaries, and references with our powerful debugging tool.
        </p>
        
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-subtle-pulse" />
            <p className="font-semibold text-green-800 dark:text-green-200 text-sm">
              🔒 Complete Privacy Protection
            </p>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Your PDF files are processed entirely in your browser. No uploads, no servers, no data transmission.
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
