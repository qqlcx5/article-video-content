<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../lib/utils";

export interface CardProps {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const props = withDefaults(defineProps<CardProps>(), {
  padding: "md",
  hover: false,
});

const cardClass = computed(() => {
  const base = [
    "bg-white",
    "rounded-[10px]",
    "border",
    "border-black/[0.06]",
    "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]",
  ];

  const paddings = {
    none: [],
    sm: ["p-3"],
    md: ["p-4"],
    lg: ["p-5"],
  };

  return cn(
    base,
    paddings[props.padding],
    props.hover && ["transition-shadow", "duration-200", "hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]"]
  );
});
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
