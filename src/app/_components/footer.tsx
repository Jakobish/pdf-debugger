import { Github, HelpCircle, Shield } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex flex-row gap-4 items-center justify-center py-4 flex-wrap">
      <Link 
        href="/privacy" 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 glass-effect px-4 py-2 rounded-full hover:scale-105 transform"
      >
        <Shield className="h-4 w-4" />
        <span>Privacy</span>
      </Link>
      <Link 
        href="/about" 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 glass-effect px-4 py-2 rounded-full hover:scale-105 transform"
      >
        <HelpCircle className="h-4 w-4" />
        <span>About</span>
      </Link>
      <Link
        href="https://github.com/hyzyla/pdf-debugger"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 glass-effect px-4 py-2 rounded-full hover:scale-105 transform"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="h-4 w-4" />
        <span>GitHub</span>
      </Link>
    </footer>
  );
}
