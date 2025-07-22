import { HelpCircle } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip";

export function HelpTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="p-1 rounded-full hover:bg-muted/50 transition-colors">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Keyboard Shortcuts:</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Search</span>
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+F</kbd>
              </div>
              <div className="flex justify-between">
                <span>Export JSON</span>
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+E</kbd>
              </div>
              <div className="flex justify-between">
                <span>Collapse All</span>
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+Shift+C</kbd>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}