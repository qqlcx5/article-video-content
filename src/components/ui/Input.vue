<script setup lang="ts">
import { computed, ref } from "vue";
import { cn } from "../../lib/utils";

export interface InputProps {
  modelValue?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: any;
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  disabled: false,
  size: "md",
});

const emit = defineEmits(["update:modelValue"]);

const input = ref<HTMLInputElement>();

const wrapperClass = computed(() => {
  return cn(
    "flex",
    "items-center",
    "gap-2",
    "bg-white",
    "border",
    "border-black/[0.6]",
    "shadow-sm",
    "rounded-md",
    "transition-all",
    "duration-200",
    "focus-within:border-black/[0.2]",
    "focus-within:shadow-md",
    props.size === "sm" ? ["h-8", "px-3"] : ["h-9", "px-3"],
    props.disabled && ["opacity-50", "cursor-not-allowed"]
  );
});

const inputClass = computed(() => {
  return cn(
    "flex-1",
    "bg-transparent",
    "border-none",
    "outline-none",
    "text-[13px]",
    "text-zinc-900",
    "placeholder:text-zinc-400",
    "focus:outline-none",
    "focus:ring-0",
    props.disabled && "cursor-not-allowed"
  );
});

const handleInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

defineExpose({
  focus: () => input.value?.focus(),
  blur: () => input.value?.blur(),
});
</script>

<template>
  <div :class="wrapperClass">
    <component v-if="icon" :is="icon" class="w-4 h-4 text-zinc-400" stroke-width="1.5" />
    <input
      ref="input"
      :type="type"
      :class="inputClass"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="handleInput"
    />
    <slot name="suffix" />
  </div>
</template>
