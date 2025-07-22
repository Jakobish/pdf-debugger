import { Moon, Sun } from "lucide-react";
+import { useEffect, useState } from "react";
 
-    --destructive: 0 84.2% 60.2%;
-    --destructive-foreground: 210 40% 98%;
+import { Button } from "@/components/button";
 
-    --border: 214.3 31.8% 91.4%;
-    --input: 214.3 31.8% 91.4%;
-    --ring: 222.2 84% 4.9%;
+export function ThemeToggle() {
+  const [theme, setTheme] = useState<'light' | 'dark'>('light');
 
-    --radius: 0.5rem;
+  useEffect(() => {
+    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
+    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
+    const initialTheme = savedTheme || systemTheme;
+    
+    setTheme(initialTheme);
+    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
+  }, []);
+
+  const toggleTheme = () => {
+    const newTheme = theme === 'light' ? 'dark' : 'light';
+    setTheme(newTheme);
+    localStorage.setItem('theme', newTheme);
+    document.documentElement.classList.toggle('dark', newTheme === 'dark');
+  };
+
+  return (
+    <Button
+      variant="ghost"
+      size="icon"
+      onClick={toggleTheme}
+      className="glass-effect hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
+    >
+      {theme === 'light' ? (
+        <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100" />
+      ) : (
+        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100" />
+      )}
+      <span className="sr-only">Toggle theme</span>
+    </Button>
+  );
+}