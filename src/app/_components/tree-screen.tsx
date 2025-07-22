import * as core from "@hyzyla/pdfjs-core";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import { TreeNote } from "@/app/_components/tree/tree-node";
import { TreeScreenMobile } from "@/app/_components/tree-screen.mobile";
import { Button } from "@/components/button";
import { filterTreeNodes } from "@/lib/pdf-walker";
import { useMediaQuery } from "@/lib/use-media-query-hook";
import { usePDFDebuggerStore } from "@/state";

export function TreeScreen(props: {
  pdf: core.PDFDocument;
  name: string | null;
  searchQuery: string;
}) {
  const store = usePDFDebuggerStore();
  const [collapseAll, setCollapseAll] = useState(false);
  const isSmScreen = useMediaQuery("(max-width: 640px)");

  const filteredRoot = useMemo(() => {
    if (!props.searchQuery.trim() || !store.rootNode) return store.rootNode;
    return filterTreeNodes(store.rootNode, props.searchQuery.toLowerCase());
  }, [store.rootNode, props.searchQuery]);

  const handleCollapseAll = () => {
    setCollapseAll(!collapseAll);
  };

  const handleExportJSON = () => {
    if (!store.rootNode) return;
    const jsonData = store.rootNode.toJSON();
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.name || "pdf-structure"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isSmScreen) {
    return (
      <TreeScreenMobile
        pdf={props.pdf}
        name={props.name}
        root={filteredRoot!}
        selected={store.selectedNode}
        onRowClick={store.onNodeClick}
        collapseAll={collapseAll}
        onCollapseAll={handleCollapseAll}
        onExportJSON={handleExportJSON}
        searchQuery={props.searchQuery}
        onSearch={store.onSearch}
        onClearSearch={() => store.onSearch("")}
      />
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden flex-col gap-4">
      <div className="border-2 border-gray-200 rounded flex-1 flex overflow-hidden flex-row">
        <div className="overflow-y-auto flex-1 p-2">
          <div className="mb-4 space-y-3">
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Export JSON
              </Button>
              <Button
                onClick={handleCollapseAll}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {collapseAll ? "Expand All" : "Collapse All"}
              </Button>
            </div>
          </div>

          {store.rootNode && filteredRoot && (
            <TreeNote node={filteredRoot} forceCollapsed={collapseAll} />
          )}
        </div>
      </div>
    </div>
  );
}
