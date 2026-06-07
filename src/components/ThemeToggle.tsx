import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita descompasso de hidratação (hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl" disabled>
        <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center border border-border/40"
      title={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600 transition-all hover:-rotate-12" />
      )}
      <span className="sr-only">Alternar Tema</span>
    </Button>
  );
}
