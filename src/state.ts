import * as core from "@hyzyla/pdfjs-core";
import { create } from "zustand";
import { PDFWalker, TreeNode, filterTreeNodes } from "@/lib/pdf-walker";

interface BaseScreen {
  screen: string;
}

interface DropzoneScreen extends BaseScreen {
  screen: "dropzone";
}

interface LoadingScreen extends BaseScreen {
  screen: "loading";
  pdfFile: Blob;
  pdfName: string;
}

interface PDFScreen extends BaseScreen {
  screen: "pdf";
  pdfName: string;
  pdfBytes: Uint8Array;
  pdfDocument: core.PDFDocument;
  isExample: boolean;
}

type Screen = DropzoneScreen | LoadingScreen | PDFScreen;

type PDFDebuggerStore = Screen & {
  pdfDocument: core.PDFDocument | null;
  pdfName: string | null;
  rootNode: TreeNode | null;
  selectedNode: TreeNode | null;
  onPDFDrop: (blob: File) => void;
  onExampleClick: () => void;
  onPDFLoad: (options: {
    pdfBytes: Uint8Array;
    pdfName: string;
    pdfDocument: core.PDFDocument;
    isExample: boolean;
  }) => void;
  reset: () => void;
  expandLevel: () => number;
  onNodeClick: (node: TreeNode) => void;
  onSearch: (query: string) => void;
};

export const usePDFDebuggerStore = create<PDFDebuggerStore>()((set, get) => ({
  screen: "dropzone",
  pdfDocument: null,
  pdfName: null,
  rootNode: null,
  selectedNode: null,
  onPDFDrop: (file) => {
    set({
      screen: "loading",
      pdfFile: file,
      pdfName: file.name,
    });
  },
  onExampleClick: () => {
    set({
      screen: "loading",
      pdfFile: new Blob(),
      pdfName: "example.pdf",
    });
  },
  onPDFLoad: (options) => {
    const walker = new PDFWalker({ pdf: options.pdfDocument });
    const root = walker.start();
    set({
      screen: "pdf",
      pdfName: options.pdfName,
      pdfBytes: options.pdfBytes,
      pdfDocument: options.pdfDocument,
      isExample: options.isExample,
      rootNode: root,
      selectedNode: null,
    });
  },
  reset: () => {
    set({
      screen: "dropzone",
      pdfDocument: null,
      pdfName: null,
      rootNode: null,
      selectedNode: null,
    });
  },
  expandLevel: () => {
    return 6;
  },
  onNodeClick: (node) => {
    set((state) => ({
      selectedNode: state.selectedNode?.path === node.path ? null : node,
    }));
  },
  onSearch: (query) => {
    set((state) => {
      if (!state.rootNode) return state;
      const filteredRoot = query.trim()
        ? filterTreeNodes(state.rootNode, query.toLowerCase())
        : state.rootNode;
      return { rootNode: filteredRoot };
    });
  },
}));
