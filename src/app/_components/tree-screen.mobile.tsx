import * as core from "@hyzyla/pdfjs-core";
import { Download } from "lucide-react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { ArrayDetails } from "@/app/_components/tree/tree-details/array-details";
import { BooleanDetails } from "@/app/_components/tree/tree-details/boolean-details";
import { DictDetails } from "@/app/_components/tree/tree-details/dict-details";
import { NameDetail } from "@/app/_components/tree/tree-details/name-details";
import { NullDetails } from "@/app/_components/tree/tree-details/null-details";
import { NumberDetails } from "@/app/_components/tree/tree-details/number-details";
import { RefDetails } from "@/app/_components/tree/tree-details/ref-details";
import { StreamContentDetails } from "@/app/_components/tree/tree-details/stream-content-details";
import { StreamDetails } from "@/app/_components/tree/tree-details/stream-details";
import { StringDetails } from "@/app/_components/tree/tree-details/string-details";
import { TreeNote } from "@/app/_components/tree/tree-node";
import { Button, buttonVariants } from "@/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/dialog";
import { TreeNode } from "@/lib/pdf-walker";
import { cn } from "@/lib/utils";

export function TreeScreenMobile(props: {
  pdf: core.PDFDocument;
  name: string | null;
  root: TreeNode;
  selected: TreeNode | null;
  onRowClick: (node: TreeNode) => void;
  collapseAll: boolean;
  onCollapseAll: () => void;
  onExportJSON: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}) {
  const { SearchBar } = require("@/app/_components/search-bar");
  const { StatsPanel } = require("@/app/_components/stats-panel");
  const { Breadcrumb } = require("@/app/_components/breadcrumb");

  return (
    <div className="flex-1 flex overflow-hidden flex-col">
      <div className="p-2 border-b">
        <StatsPanel root={props.root} />
      </div>

      <div className="p-2 flex justify-end gap-2 border-b">
        <SearchBar
          onSearch={props.onSearch}
          onClear={props.onClearSearch}
          placeholder="Search..."
          className="flex-1 mr-2"
        />
        <Button
          onClick={props.onExportJSON}
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1"
        >
          <Download className="h-3 w-3" />
          Export JSON
        </Button>
        <Button
          onClick={props.onCollapseAll}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          {props.collapseAll ? "Expand All" : "Collapse All"}
        </Button>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        <Breadcrumb
          selectedNode={props.selected}
          onNodeClick={props.onRowClick}
          className="mb-4"
        />
        <TreeNote
          node={props.root}
          selected={props.selected}
          onNodeClick={props.onRowClick}
          forceCollapsed={props.collapseAll}
        />
      </div>
      {props.selected && (
        <>
          <Dialog modal={true}>
            <DialogTrigger
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
              )}
            >
              <MdKeyboardArrowDown className="mr-2" />
              Show details
            </DialogTrigger>
            <DialogContent
              className={
                "lg:max-w-screen-lg overflow-y-scroll max-h-[100dvh] min-h-[100dvh]"
              }
            >
              {props.selected && (
                <>
                  {props.selected.type === "array" && (
                    <ArrayDetails node={props.selected} />
                  )}
                  {props.selected.type === "boolean" && (
                    <BooleanDetails node={props.selected} />
                  )}
                  {props.selected.type === "dict" && (
                    <DictDetails node={props.selected} />
                  )}
                  {props.selected.type === "name" && (
                    <NameDetail node={props.selected} />
                  )}
                  {props.selected.type === "null" && (
                    <NullDetails node={props.selected} />
                  )}
                  {props.selected.type === "number" && (
                    <NumberDetails node={props.selected} />
                  )}
                  {props.selected.type === "ref" && (
                    <RefDetails node={props.selected} />
                  )}
                  {props.selected.type === "stream" && (
                    <StreamDetails node={props.selected} />
                  )}
                  {props.selected.type === "stream-content" && (
                    <StreamContentDetails node={props.selected} />
                  )}
                  {props.selected.type === "string" && (
                    <StringDetails node={props.selected} />
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
