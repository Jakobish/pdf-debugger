import { FileText } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header(props: { onClick: () => void }) {
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
      <ThemeToggle />
    </header>
  );
}
