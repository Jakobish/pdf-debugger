import { useEffect } from "react";

interface KeyboardShortcutProps {
  keys: string[];
  onTrigger: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcut({ keys, onTrigger, disabled = false }: KeyboardShortcutProps) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = [];
      
      if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
      if (event.shiftKey) pressedKeys.push('shift');
      if (event.altKey) pressedKeys.push('alt');
      
      pressedKeys.push(event.key.toLowerCase());
      
      const shortcutString = pressedKeys.join('+');
      const targetString = keys.join('+');
      
      if (shortcutString === targetString) {
        event.preventDefault();
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, onTrigger, disabled]);
}