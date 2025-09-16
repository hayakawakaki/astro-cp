<script setup lang="ts">
import type { InputTypeHTMLAttribute } from "vue";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { computed, useSlots } from "vue";

import type { UIColor, UISize, UIVariant } from "@/types";

type InputType = {
  name: string;
  variant?: UIVariant;
  color?: UIColor;
  size?: UISize;
  class?: string;
  id?: string;
  placeholder?: string;
  type?: InputTypeHTMLAttribute;
  required?: boolean;
  autocomplete?: string;
  hideLabel?: boolean;
  modelValue?: string | number;
  disabled?: boolean;
  readonly?: boolean;
};

const {
  variant = "outline",
  color = "primary",
  size = "md",
  hideLabel = true,
  type = "text",
  required = false,
  disabled = false,
  readonly = false,
  modelValue,
  ...props
} = defineProps<InputType>();

const emit = defineEmits(["update:modelValue"]);
const slots = useSlots();

const hasIcon = slots.icon;

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

const labelClass = computed(() =>
  twMerge(
    "block font-medium text-gray-700",
    hideLabel ? "sr-only" : "mb-1",
    (size === "xs" || size === "sm") ? "text-xs" : "text-sm",
  ),
);

const inputClass = computed(() => {
  const base = "block w-full rounded-md transition-colors duration-200 focus:outline-none";

  const sizes = {
    xs: "px-2 py-1 text-sm",
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-base",
    xl: "px-4 py-3 text-base",
  };

  const variants = {
    solid: {
      primary: "bg-primary-500 text-white placeholder-primary-200 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2",
      secondary: "bg-secondary-500 text-white placeholder-secondary-200 focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2",
      accent: "bg-accent-500 text-white placeholder-accent-200 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2",
      red: "bg-red-500 text-white placeholder-red-200 focus:ring-2 focus:ring-red-400 focus:ring-offset-2",
      orange: "bg-orange-500 text-white placeholder-orange-200 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2",
      amber: "bg-amber-500 text-white placeholder-amber-200 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
      yellow: "bg-yellow-500 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
      lime: "bg-lime-500 text-white placeholder-lime-200 focus:ring-2 focus:ring-lime-400 focus:ring-offset-2",
      green: "bg-green-500 text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 focus:ring-offset-2",
      emerald: "bg-emerald-500 text-white placeholder-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2",
      teal: "bg-teal-500 text-white placeholder-teal-200 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2",
      cyan: "bg-cyan-500 text-white placeholder-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2",
      sky: "bg-sky-500 text-white placeholder-sky-200 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
      blue: "bg-blue-500 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
      indigo: "bg-indigo-500 text-white placeholder-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2",
      violet: "bg-violet-500 text-white placeholder-violet-200 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2",
      purple: "bg-purple-500 text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
      fuchsia: "bg-fuchsia-500 text-white placeholder-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2",
      pink: "bg-pink-500 text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2",
      rose: "bg-rose-500 text-white placeholder-rose-200 focus:ring-2 focus:ring-rose-400 focus:ring-offset-2",
      slate: "bg-slate-500 text-white placeholder-slate-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
      gray: "bg-gray-500 text-white placeholder-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
      zinc: "bg-zinc-500 text-white placeholder-zinc-200 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
      neutral: "bg-neutral-500 text-white placeholder-neutral-200 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
      stone: "bg-stone-500 text-white placeholder-stone-200 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2",
    },
    subtle: {
      primary: "bg-primary-50 text-primary-900 placeholder-primary-400 border border-primary-200 focus:bg-primary-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
      secondary: "bg-secondary-50 text-secondary-900 placeholder-secondary-400 border border-secondary-200 focus:bg-secondary-100 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20",
      accent: "bg-accent-50 text-accent-900 placeholder-accent-400 border border-accent-200 focus:bg-accent-100 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20",
      red: "bg-red-50 text-red-900 placeholder-red-400 border border-red-200 focus:bg-red-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
      orange: "bg-orange-50 text-orange-900 placeholder-orange-400 border border-orange-200 focus:bg-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
      amber: "bg-amber-50 text-amber-900 placeholder-amber-400 border border-amber-200 focus:bg-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
      yellow: "bg-yellow-50 text-yellow-900 placeholder-yellow-400 border border-yellow-200 focus:bg-yellow-100 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20",
      lime: "bg-lime-50 text-lime-900 placeholder-lime-400 border border-lime-200 focus:bg-lime-100 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20",
      green: "bg-green-50 text-green-900 placeholder-green-400 border border-green-200 focus:bg-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
      emerald: "bg-emerald-50 text-emerald-900 placeholder-emerald-400 border border-emerald-200 focus:bg-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
      teal: "bg-teal-50 text-teal-900 placeholder-teal-400 border border-teal-200 focus:bg-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
      cyan: "bg-cyan-50 text-cyan-900 placeholder-cyan-400 border border-cyan-200 focus:bg-cyan-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
      sky: "bg-sky-50 text-sky-900 placeholder-sky-400 border border-sky-200 focus:bg-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
      blue: "bg-blue-50 text-blue-900 placeholder-blue-400 border border-blue-200 focus:bg-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
      indigo: "bg-indigo-50 text-indigo-900 placeholder-indigo-400 border border-indigo-200 focus:bg-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
      violet: "bg-violet-50 text-violet-900 placeholder-violet-400 border border-violet-200 focus:bg-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
      purple: "bg-purple-50 text-purple-900 placeholder-purple-400 border border-purple-200 focus:bg-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
      fuchsia: "bg-fuchsia-50 text-fuchsia-900 placeholder-fuchsia-400 border border-fuchsia-200 focus:bg-fuchsia-100 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20",
      pink: "bg-pink-50 text-pink-900 placeholder-pink-400 border border-pink-200 focus:bg-pink-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
      rose: "bg-rose-50 text-rose-900 placeholder-rose-400 border border-rose-200 focus:bg-rose-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
      slate: "bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 focus:bg-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20",
      gray: "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:bg-gray-100 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20",
      zinc: "bg-zinc-50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:bg-zinc-100 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20",
      neutral: "bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:bg-neutral-100 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20",
      stone: "bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 focus:bg-stone-100 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20",
    },
    outline: {
      primary: "bg-white border border-primary-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
      secondary: "bg-white border border-secondary-300 text-gray-900 placeholder-gray-400 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20",
      accent: "bg-white border border-accent-300 text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20",
      red: "bg-white border border-red-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
      orange: "bg-white border border-orange-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
      amber: "bg-white border border-amber-300 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
      yellow: "bg-white border border-yellow-300 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20",
      lime: "bg-white border border-lime-300 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20",
      green: "bg-white border border-green-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
      emerald: "bg-white border border-emerald-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
      teal: "bg-white border border-teal-300 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
      cyan: "bg-white border border-cyan-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
      sky: "bg-white border border-sky-300 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
      blue: "bg-white border border-blue-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
      indigo: "bg-white border border-indigo-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
      violet: "bg-white border border-violet-300 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
      purple: "bg-white border border-purple-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
      fuchsia: "bg-white border border-fuchsia-300 text-gray-900 placeholder-gray-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20",
      pink: "bg-white border border-pink-300 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
      rose: "bg-white border border-rose-300 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
      slate: "bg-white border border-slate-300 text-gray-900 placeholder-gray-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20",
      gray: "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20",
      zinc: "bg-white border border-zinc-300 text-gray-900 placeholder-gray-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20",
      neutral: "bg-white border border-neutral-300 text-gray-900 placeholder-gray-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20",
      stone: "bg-white border border-stone-300 text-gray-900 placeholder-gray-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20",
    },
    ghost: {
      primary: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-primary-300 rounded-none focus:border-primary-500 focus:ring-0",
      secondary: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-secondary-300 rounded-none focus:border-secondary-500 focus:ring-0",
      accent: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-accent-300 rounded-none focus:border-accent-500 focus:ring-0",
      red: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-red-300 rounded-none focus:border-red-500 focus:ring-0",
      orange: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-orange-300 rounded-none focus:border-orange-500 focus:ring-0",
      amber: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-amber-300 rounded-none focus:border-amber-500 focus:ring-0",
      yellow: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-yellow-300 rounded-none focus:border-yellow-500 focus:ring-0",
      lime: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-lime-300 rounded-none focus:border-lime-500 focus:ring-0",
      green: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-green-300 rounded-none focus:border-green-500 focus:ring-0",
      emerald: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-emerald-300 rounded-none focus:border-emerald-500 focus:ring-0",
      teal: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-teal-300 rounded-none focus:border-teal-500 focus:ring-0",
      cyan: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-cyan-300 rounded-none focus:border-cyan-500 focus:ring-0",
      sky: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-sky-300 rounded-none focus:border-sky-500 focus:ring-0",
      blue: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-blue-300 rounded-none focus:border-blue-500 focus:ring-0",
      indigo: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-indigo-300 rounded-none focus:border-indigo-500 focus:ring-0",
      violet: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-violet-300 rounded-none focus:border-violet-500 focus:ring-0",
      purple: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-purple-300 rounded-none focus:border-purple-500 focus:ring-0",
      fuchsia: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-fuchsia-300 rounded-none focus:border-fuchsia-500 focus:ring-0",
      pink: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-pink-300 rounded-none focus:border-pink-500 focus:ring-0",
      rose: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-rose-300 rounded-none focus:border-rose-500 focus:ring-0",
      slate: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-slate-300 rounded-none focus:border-slate-500 focus:ring-0",
      gray: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-gray-300 rounded-none focus:border-gray-500 focus:ring-0",
      zinc: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-zinc-300 rounded-none focus:border-zinc-500 focus:ring-0",
      neutral: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-neutral-300 rounded-none focus:border-neutral-500 focus:ring-0",
      stone: "bg-transparent text-gray-900 placeholder-gray-400 border-b border-stone-300 rounded-none focus:border-stone-500 focus:ring-0",
    },
  };

  const disabledClass = disabled || readonly ? "opacity-60 cursor-not-allowed" : "";
  const iconClass = hasIcon && "pl-12";

  return twMerge(
    clsx(
      base,
      sizes[size],
      variants[variant][color],
      disabledClass,
      props.class,
      iconClass,
    ),
  );
});
</script>

<template>
  <div>
    <label
      :class="labelClass"
      :for="id || name"
    >
      {{ name }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative flex items-center">
      <span v-if="hasIcon" class="pl-4 absolute top-1/2 -translate-y-1/2 *:max-h-5 *:w-auto">
        <slot name="icon" />
      </span>
      <input
        :id="id || name"
        :type="type"
        :name="name"
        :class="inputClass"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :readonly="readonly"
        :value="modelValue"
        @input="handleInput"
      >
    </div>
  </div>
</template>
