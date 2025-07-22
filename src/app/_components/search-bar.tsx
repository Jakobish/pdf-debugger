import { Search, X } from "lucide-react";
import { useEffect,useState } from "react";

import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  query,
  onSearch,
  onClear,
  placeholder = "Search PDF structure...",
  className,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const [internalQuery, setInternalQuery] = useState(query);

  useEffect(() => {
    setInternalQuery(query);
  }, [query]);

  const handleSearch = (value: string) => {
    setInternalQuery(value);
    // Debounce the actual search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    setInternalQuery("");
    onClear();
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div
        className={cn(
          "relative flex items-center w-full glass-effect rounded-lg border transition-all duration-300",
          isFocused ? "border-primary/60 shadow-lg" : "border-border",
        )}
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={internalQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
        />
        {internalQuery && (
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
