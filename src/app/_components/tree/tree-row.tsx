import * as core from "@hyzyla/pdfjs-core";
import {
  ChevronDown,
  ChevronRight,
  Code,
  File,
  Hash,
  HelpCircle,
  Layers,
  Link,
  MinusCircle,
  Quote,
  Square,
  Type,
} from "lucide-react";

import { TreeNode } from "@/lib/pdf-walker";

function TreeRowBase(props: {
  icon: React.ComponentType<any>;
  iconColor: string;
  name?: string;
  value?: React.ReactNode;
  expanded: boolean;
  node: TreeNode;
  onExpandClick: (e: React.MouseEvent) => void;
}) {
  const ExpandIcon = props.expanded ? ChevronDown : ChevronRight;
  return (
    <>
      <div className="flex items-center gap-1 h-[24px]">
        {props.node.children.length > 0 ? (
          <div
            className="min-w-[16px] min-h-[16px] flex justify-center items-center hover:bg-gray-300 rounded"
            onClick={props.onExpandClick}
          >
            <ExpandIcon className="min-w-[16px] min-h-[16px]" />
          </div>
        ) : (
          <div className="min-w-[16px] min-h-[16px]"></div>
        )}
        <props.icon
          className={`${props.iconColor} min-w-[16px] min-h-[16px]`}
        />
        {props.name && <span>{props.name}:</span>}
      </div>
      {props.value && <span className="text-gray-500">{props.value}</span>}
    </>
  );
}

export function TreeRow(props: {
  node: TreeNode;
  expanded: boolean;
  onExpandClick: (e: React.MouseEvent) => void;
  onRefClick: (e: React.MouseEvent, node: TreeNode<core.Ref>) => void;
}) {
  const { node, expanded, onExpandClick, onRefClick } = props;
  if (node.isDict()) {
    return (
      <TreeRowBase
        icon={Layers}
        iconColor="text-green-600"
        name={node.name}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isArray()) {
    return (
      <TreeRowBase
        icon={Hash}
        iconColor="text-purple-600"
        name={node.name}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isRef()) {
    return (
      <TreeRowBase
        icon={Link}
        iconColor="text-blue-600"
        name={node.name}
        value={
          <div
            onClick={(e) => onRefClick(e, node)}
            className="hover:bg-gray-300 rounded"
          >
            ref(num={node.obj.num}, gen={node.obj.gen})
          </div>
        }
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isStream()) {
    return (
      <TreeRowBase
        icon={File}
        iconColor="text-fuchsia-600"
        name={node.name}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isStreamContent()) {
    return (
      <TreeRowBase
        icon={Code}
        iconColor="text-gray-500"
        name={node.name}
        value={`[...stream contents...]`}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isName()) {
    return (
      <TreeRowBase
        icon={Type}
        iconColor="text-yellow-600"
        name={node.name}
        value={`/${node.obj.name}`}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isNumber()) {
    return (
      <TreeRowBase
        icon={Hash}
        iconColor="text-blue-600"
        name={node.name}
        value={node.obj.toString()}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isString()) {
    return (
      <TreeRowBase
        icon={Quote}
        iconColor="text-red-600"
        name={node.name}
        value={node.obj}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isBoolean()) {
    return (
      <TreeRowBase
        icon={Square}
        iconColor="text-green-600"
        name={node.name}
        value={node.obj.toString()}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else if (node.isNull()) {
    return (
      <TreeRowBase
        icon={MinusCircle}
        iconColor="text-gray-500"
        name={node.name}
        value={`null`}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  } else {
    return (
      <TreeRowBase
        icon={HelpCircle}
        iconColor="text-gray-500"
        name={node.name}
        value={`[unknown]`}
        expanded={expanded}
        node={node}
        onExpandClick={onExpandClick}
      />
    );
  }
}
