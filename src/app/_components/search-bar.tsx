import { Search, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, onClear, placeholder = "Search PDF structure...", className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className={cn(
        "relative flex items-center w-full glass-effect rounded-lg border transition-all duration-300",
        isFocused ? "border-primary/60 shadow-lg" : "border-border"
      )}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 h-6 w-6 p-0 hover:bg-muted/50"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}