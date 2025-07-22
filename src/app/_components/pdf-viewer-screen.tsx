"use client";

import { useState } from "react";

import { Breadcrumb } from "@/app/_components/breadcrumb";
import { SearchBar } from "@/app/_components/search-bar";
import { StatsPanel } from "@/app/_components/stats-panel";
import { TreeDetails } from "@/app/_components/tree/tree-details";
import { TreeScreen } from "@/app/_components/tree-screen";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable"; // Assuming resizable components exist or will be created
import { usePDFDebuggerStore } from "@/state";

interface PdfViewerScreenProps {
  pdf: any; // Replace with actual PDF document type
  name: string;
}

export function PdfViewerScreen({ pdf, name }: PdfViewerScreenProps) {
  const store = usePDFDebuggerStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    store.onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    store.onSearch("");
  };

  const handleStatClick = (type: string) => {
    store.onStatClick(type);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <ResizablePanel
        defaultSize={{ width: 30 }}
        minSize={{ width: 20 }}
        className="flex flex-col"
      >
        <div className="p-2 border-b">
          <SearchBar
            query={searchQuery}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            className="mb-2"
          />
          <Breadcrumb
            selectedNode={store.selectedNode}
            onNodeClick={store.onNodeClick}
            className="mb-2"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <TreeScreen pdf={pdf} name={name} searchQuery={searchQuery} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={{ width: 70 }}
        minSize={{ width: 30 }}
        className="flex flex-col"
      >
        <div className="p-2 border-b">
          {store.rootNode && (
            <StatsPanel root={store.rootNode} onStatClick={handleStatClick} />
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {store.selectedNode ? (
            <TreeDetails node={store.selectedNode} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a node to view its details.
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
