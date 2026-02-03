<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../lib/utils";

export interface ButtonProps {
  variant?: "default" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: any;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "default",
  size: "md",
  disabled: false,
});

const emit = defineEmits(["click"]);

const buttonClass = computed(() => {
  const base = [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "font-medium",
    "transition-all",
    "duration-200",
    "rounded-md",
    "cursor-pointer",
    "border-none",
    "outline-none",
  ];

  const variants = {
    default: [
      "bg-black",
      "text-white",
      "hover:bg-black/90",
      "active:bg-black/80",
    ],
    ghost: [
      "bg-transparent",
      "text-zinc-500",
      "hover:bg-black/[0.04]",
      "hover:text-zinc-900",
      "active:bg-black/[0.08]",
    ],
    subtle: [
      "bg-zinc-100",
      "text-zinc-700",
      "hover:bg-zinc-200",
      "active:bg-zinc-300",
    ],
  };

  const sizes = {
    sm: ["h-7", "px-2", "text-[12px]"],
    md: ["h-8", "px-3", "text-[13px]"],
    lg: ["h-9", "px-4", "text-[14px]"],
  };

  return cn(
    base,
    variants[props.variant],
    sizes[props.size],
    props.disabled && ["opacity-50", "cursor-not-allowed"]
  );
});

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit("click", e);
  }
};
</script>

<template>
  <button :class="buttonClass" :disabled="disabled" @click="handleClick">
    <component v-if="icon" :is="icon" class="w-4 h-4" stroke-width="1.5" />
    <slot />
  </button>
</template>
