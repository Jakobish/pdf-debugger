"use client";

import { Resizable as ResizablePrimitive } from "re-resizable";
import * as React from "react";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive> & {
    direction: "horizontal" | "vertical";
  }
>(({ className, direction, ...props }, ref) => (
  <ResizablePrimitive
    ref={ref}
    enable={{
      top: direction === "vertical",
      bottom: direction === "vertical",
      left: direction === "horizontal",
      right: direction === "horizontal",
    }}
    className={cn(
      "flex w-full data-[panel-group-direction=vertical]:flex-col",
      className,
    )}
    {...props}
  />
));
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive> & {
    defaultSize: { width?: number; height?: number };
    minSize: { width?: number; height?: number };
  }
>(({ className, defaultSize, minSize, ...props }, ref) => {
  const enable = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  if (defaultSize.width !== undefined) {
    enable.right = true;
  }
  if (defaultSize.height !== undefined) {
    enable.bottom = true;
  }

  return (
    <ResizablePrimitive
      ref={ref}
      defaultSize={defaultSize}
      minSize={minSize}
      enable={enable}
      className={cn("relative flex h-full w-full flex-col", className)}
      {...props}
    />
  );
});
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive> & {
    withHandle?: boolean;
  }
>(({ withHandle, className, ...props }, ref) => {
  const enable = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  return (
    <ResizablePrimitive
      ref={ref}
      enable={enable}
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&.vertical]:h-px [&.vertical]:w-full [&.vertical]:after:left-0 [&.vertical]:after:h-1 [&.vertical]:after:w-full [&.vertical]:after:-translate-y-1/2 [&.vertical]:after:translate-x-0",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-2.5 w-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      )}
    </ResizablePrimitive>
  );
});
ResizableHandle.displayName = "ResizableHandle";

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
