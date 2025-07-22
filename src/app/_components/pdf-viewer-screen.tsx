"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/app/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <Card className="w-full h-full bg-background text-foreground shadow-xl border border-border rounded-xl">
      <CardContent className="p-0 h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 overflow-hidden h-full"
        >
          <ResizablePanel
            defaultSize={{ width: 50 }}
            minSize={{ width: 30 }}
            className="flex flex-col min-w-[320px] bg-card rounded-l-xl shadow-md border-r border-border"
          >
            <div className="p-4 border-b border-border bg-card-foreground rounded-tl-xl">
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="mb-2"
              />
              <Breadcrumb
                selectedNode={store.selectedNode}
                onNodeClick={store.onNodeClick}
                className="mb-2"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <TreeScreen pdf={pdf} name={name} searchQuery={searchQuery} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={{ width: 50 }}
            minSize={{ width: 30 }}
            className="flex flex-col min-w-[320px] bg-card rounded-r-xl shadow-md border-l border-border"
          >
            <div className="p-4 border-b border-border bg-card-foreground rounded-tr-xl flex items-center gap-2">
              <Sparkles className="text-primary w-5 h-5 animate-subtle-pulse" />
              <span className="font-semibold text-lg">Stats & Details</span>
              {store.rootNode && (
                <StatsPanel
                  root={store.rootNode}
                  onStatClick={handleStatClick}
                />
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
              {store.selectedNode ? (
                <TreeDetails node={store.selectedNode} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Sparkles className="w-8 h-8 text-primary animate-gentle-float" />
                  <span className="text-xl font-semibold">
                    Select a node to view details
                  </span>
                  <span className="text-sm">
                    Tip: Click any item in the tree to see its info here!
                  </span>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
