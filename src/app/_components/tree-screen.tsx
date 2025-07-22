import * as core from "@hyzyla/pdfjs-core";
import { Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/button";
import { TreeNodeDetails } from "@/app/_components/tree/tree-details";
import { TreeNote } from "@/app/_components/tree/tree-node";
import { TreeScreenMobile } from "@/app/_components/tree-screen.mobile";
import { PDFWalker, TreeNode } from "@/lib/pdf-walker";
import { useMediaQuery } from "@/lib/use-media-query-hook";
import { useResizer } from "@/lib/use-resizer-hook";

export function TreeScreen(props: {
  pdf: core.PDFDocument;
  name: string | null;
}) {
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [collapseAll, setCollapseAll] = useState(false);
  const isSmScreen = useMediaQuery("(max-width: 640px)");
  const walker = new PDFWalker({ pdf: props.pdf });
  const root = walker.start();

  const onRowClick = (node: TreeNode) => {
    if (selected?.path === node.path) {
      setSelected(null); // deselect
    } else {
      setSelected(node);
    }
  };

  const handleCollapseAll = () => {
    setCollapseAll(!collapseAll);
  };

  const handleExportJSON = () => {
    const jsonData = root.toJSON();
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

  const { sidebarRef, startResizing, sidebarWidth } = useResizer();

  if (isSmScreen) {
    return (
      <TreeScreenMobile
        pdf={props.pdf}
        name={props.name}
        root={root}
        selected={selected}
        onRowClick={onRowClick}
        collapseAll={collapseAll}
        onCollapseAll={handleCollapseAll}
        onExportJSON={handleExportJSON}
      />
    );
  }

  return (
    <div className="border-2 border-gray-200 rounded flex-1 flex overflow-hidden flex-row">
      <div className="overflow-y-auto sm:w-1/3 flex-1 p-2">
        <div className="mb-3 flex justify-end gap-2">
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
        <TreeNote 
          node={root} 
          onClick={onRowClick} 
          selected={selected}
          forceCollapsed={collapseAll}
        />
      </div>
      <div
        className="min-w-[6px] cursor-col-resize border-l-2 border-gray-200"
        onMouseDown={startResizing}
      />
      <div
        className="overflow-y-auto"
        ref={sidebarRef}
        style={{ width: sidebarWidth ?? "33%" }}
      >
        {selected && <TreeNodeDetails node={selected} />}
      </div>
    </div>
  );
}
