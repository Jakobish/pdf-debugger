import * as core from "@hyzyla/pdfjs-core";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import { Breadcrumb } from "@/app/_components/breadcrumb";
import { SearchBar } from "@/app/_components/search-bar";
import { StatsPanel } from "@/app/_components/stats-panel";
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
  const [searchQuery, setSearchQuery] = useState("");
  const isSmScreen = useMediaQuery("(max-width: 640px)");
  const walker = new PDFWalker({ pdf: props.pdf });
  const root = walker.start();

  // Filter nodes based on search query
  const filteredRoot = useMemo(() => {
    if (!searchQuery.trim()) return root;
    return filterTreeNodes(root, searchQuery.toLowerCase());
  }, [root, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCollapseAll(false); // Expand when searching
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

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
        root={filteredRoot}
        selected={selected}
        onRowClick={onRowClick}
        collapseAll={collapseAll}
        onCollapseAll={handleCollapseAll}
        onExportJSON={handleExportJSON}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden flex-col gap-4">
      <StatsPanel root={root} />
      
      <div className="border-2 border-gray-200 rounded flex-1 flex overflow-hidden flex-row">
      <div className="overflow-y-auto sm:w-1/3 flex-1 p-2">
        <div className="mb-4 space-y-3">
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search objects, keys, values..."
          />
          
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
          
          <Breadcrumb
            selectedNode={selected}
            onNodeClick={onRowClick}
          />
        </div>
        
        <TreeNote 
          node={filteredRoot} 
          onClick={onRowClick} 
          selected={selected}
          forceCollapsed={collapseAll}
        />
      </div>
      </div>
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