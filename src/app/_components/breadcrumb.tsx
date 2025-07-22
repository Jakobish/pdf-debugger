import { ChevronRight, Home } from "lucide-react";

import { TreeNode } from "@/lib/pdf-walker";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  selectedNode: TreeNode | null;
  onNodeClick: (node: TreeNode) => void;
  className?: string;
}

export function Breadcrumb({ selectedNode, onNodeClick, className }: BreadcrumbProps) {
  if (!selectedNode) return null;

  const pathNodes = getPathNodes(selectedNode);

  return (
    <div className={cn("flex items-center gap-1 text-sm text-muted-foreground mb-4 overflow-x-auto", className)}>
      <div className="flex items-center gap-1 whitespace-nowrap">
        <Home className="h-3 w-3" />
        <span>Root</span>
      </div>
      
      {pathNodes.map((node, index) => (
        <div key={node.path} className="flex items-center gap-1 whitespace-nowrap">
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <button
            onClick={() => onNodeClick(node)}
            className={cn(
              "hover:text-foreground transition-colors truncate max-w-32",
              index === pathNodes.length - 1 ? "text-foreground font-medium" : "hover:underline"
            )}
            title={node.name || node.index?.toString() || "unnamed"}
          >
            {node.name || `[${node.index}]` || "unnamed"}
          </button>
        </div>
      ))}
    </div>
  );
}

function getPathNodes(node: TreeNode): TreeNode[] {
  const nodes: TreeNode[] = [];
  let current: TreeNode | undefined = node;
  
  while (current && current.parent) {
    nodes.unshift(current);
    current = current.parent;
  }
  
  return nodes;
}