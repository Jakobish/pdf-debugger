import * as core from "@hyzyla/pdfjs-core";
import classNames from "classnames";
import { useState } from "react";

import { TreeRow } from "@/app/_components/tree/tree-row";
import { TreeNode } from "@/lib/pdf-walker";
import { usePDFDebuggerStore } from "@/state";

export function TreeNote(props: {
  node: TreeNode;
  selected: TreeNode | null;
  onClick: (node: TreeNode) => void;
  forceCollapsed?: boolean;
}) {
  const node = props.node;

  const expandLevel = usePDFDebuggerStore((state) => state.expandLevel());
  const [expanded, setExpanded] = useState(node.depth < expandLevel);

  // Override expanded state when forceCollapsed is true
  const isExpanded = props.forceCollapsed ? false : expanded;
  const onClick = () => {
    if (!props.forceCollapsed) {
      setExpanded(!expanded);
    }
    props.onClick(node);
  };

  const onExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!props.forceCollapsed) {
      setExpanded(!expanded);
    }
  };

  const onRefClick = (e: React.MouseEvent, node: TreeNode<core.Ref>) => {
    e.stopPropagation();

    const element = document.getElementById(
      `ref-${node.obj.num}-${node.obj.gen}`,
    );
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // highlight the element
    element.classList.add("bg-yellow-200", "dark:bg-yellow-800");
    element.classList.add("bg-opacity-100");
    setTimeout(() => {
      element.classList.remove("bg-yellow-200", "dark:bg-yellow-800");
      element.classList.add("bg-opacity-0");
    }, 2000);
  };

  const ref = props.node.ref;

  const isSelected = props.selected?.path === node.path;
  return (
    <div>
      <div
        id={ref ? `ref-${ref.num}-${ref.gen}` : undefined}
        onClick={onClick}
        className={classNames(
          "cursor-pointer hover:bg-gray-200 px-2 rounded flex gap-1 min-h-6 flex-row items-start  transition-all bg-opacity-0",
          {
            "bg-gray-100": isSelected,
            "bg-opacity-100": isSelected,
          },
        )}
      >
        <TreeRow
          node={node}
          expanded={isExpanded}
          onExpandClick={onExpandClick}
          onRefClick={onRefClick}
        />
      </div>
      {isExpanded && (
        <ul className="ml-6">
          {node.children.map((child) => (
            <li key={child.uniqueId}>
              <TreeNote
                node={child}
                onClick={props.onClick}
                selected={props.selected}
                forceCollapsed={props.forceCollapsed}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
