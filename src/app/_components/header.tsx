import { FileText } from "lucide-react";

import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header(props: { onClick: () => void; showHomeButton?: boolean }) {
  return (
    <header className="flex items-center justify-between w-full">
      <div 
        className="flex items-center gap-3 cursor-pointer group transition-all duration-300"
        onClick={props.onClick}
      >
        <div className="p-2 rounded-xl glass-effect group-hover:scale-110 transition-transform duration-300">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">
          PDF Debugger
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {props.showHomeButton && (
          <Button
            onClick={props.onClick}
            variant="outline"
            size="sm"
            className="glass-effect hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
          >
            Start Over
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
