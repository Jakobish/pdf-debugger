import { BarChart3, FileText, Hash, Layers } from "lucide-react";

import { TreeNode } from "@/lib/pdf-walker";

interface StatsPanelProps {
  root: TreeNode;
}

export function StatsPanel({ root }: StatsPanelProps) {
  const stats = calculateStats(root);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <StatCard
        icon={FileText}
        label="Total Objects"
        value={stats.totalObjects}
        color="text-blue-600"
      />
      <StatCard
        icon={Layers}
        label="Dictionaries"
        value={stats.dictionaries}
        color="text-green-600"
      />
      <StatCard
        icon={Hash}
        label="Arrays"
        value={stats.arrays}
        color="text-purple-600"
      />
      <StatCard
        icon={BarChart3}
        label="Max Depth"
        value={stats.maxDepth}
        color="text-orange-600"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass-effect rounded-lg p-4 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-muted/50`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function calculateStats(node: TreeNode): {
  totalObjects: number;
  dictionaries: number;
  arrays: number;
  maxDepth: number;
} {
  let totalObjects = 0;
  let dictionaries = 0;
  let arrays = 0;
  let maxDepth = 0;

  function traverse(node: TreeNode) {
    totalObjects++;
    maxDepth = Math.max(maxDepth, node.depth);

    if (node.isDict()) dictionaries++;
    if (node.isArray()) arrays++;

    node.children.forEach(traverse);
  }

  traverse(node);

  return { totalObjects, dictionaries, arrays, maxDepth };
}