import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      border: "hsl(var(--border))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
  shortcuts: {
    // Layout shortcuts
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-start": "flex items-center justify-start",
    "flex-col-center": "flex flex-col items-center justify-center",

    // Border shortcuts (Linear style - use transparency)
    "border-subtle": "border border-black/[0.06]",
    "border-l-subtle": "border-l border-black/[0.06]",
    "border-r-subtle": "border-r border-black/[0.06]",
    "border-t-subtle": "border-t border-black/[0.06]",
    "border-b-subtle": "border-b border-black/[0.06]",

    // Text shortcuts
    "text-subtle": "text-zinc-500",
    "text-muted": "text-zinc-400",

    // Hover effects (Arc style - subtle backgrounds)
    "hover-bg": "transition-colors duration-200 hover:bg-black/[0.04]",
    "hover-bg-stronger": "transition-colors duration-200 hover:bg-black/[0.08]",

    // Card/Surface shortcuts
    "surface-card": "bg-white border-subtle rounded-[10px]",
    "surface-subtle": "bg-[#F4F4F5] border-subtle rounded-[10px]",

    // Button base (Arc sidebar style)
    "btn-ghost": "h-8 text-[13px] justify-start text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04] transition-colors duration-200 rounded-md px-2",

    // Shadow shortcuts
    "shadow-soft": "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]",
    "shadow-soft-lg": "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]",
  },
  rules: [
    // Custom icon rule for lucide
    ["icon", { "stroke-width": "1.5", "width": "15", "height": "15" }],
  ],
});
