<script setup lang="ts">
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs } from "vue";

import type { UIColor, UISize, UIVariant } from "@/types";

type ButtonBase = {
  variant?: UIVariant;
  color?: UIColor;
  size?: UISize;
  class?: string;
  id?: string;
};

type ButtonProps
  = ButtonBase & {
    href?: string;
    action?: never;
    disabled?: never;
    type?: never;
    target?: "_blank" | "_self" | "_parent" | "_top";
  }
  | ButtonBase & {
    href?: never;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    target?: never;
  };

defineOptions({
  inheritAttrs: false,
});

const {
  variant = "solid",
  color = "primary",
  size = "md",
  ...props
} = defineProps<ButtonProps>();

const attrs = useAttrs();

const buttonClasses = computed(() => {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const sizes = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    xl: "h-12 px-8 text-lg",
  };

  const variants = {
    solid: {
      primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
      secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500",
      accent: "bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500",
      red: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
      orange: "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500",
      amber: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
      yellow: "bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-500",
      lime: "bg-lime-500 text-white hover:bg-lime-600 focus-visible:ring-lime-500",
      green: "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500",
      emerald: "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500",
      teal: "bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-500",
      cyan: "bg-cyan-500 text-white hover:bg-cyan-600 focus-visible:ring-cyan-500",
      sky: "bg-sky-500 text-white hover:bg-sky-600 focus-visible:ring-sky-500",
      blue: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500",
      indigo: "bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:ring-indigo-500",
      violet: "bg-violet-500 text-white hover:bg-violet-600 focus-visible:ring-violet-500",
      purple: "bg-purple-500 text-white hover:bg-purple-600 focus-visible:ring-purple-500",
      fuchsia: "bg-fuchsia-500 text-white hover:bg-fuchsia-600 focus-visible:ring-fuchsia-500",
      pink: "bg-pink-500 text-white hover:bg-pink-600 focus-visible:ring-pink-500",
      rose: "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500",
      slate: "bg-slate-500 text-white hover:bg-slate-600 focus-visible:ring-slate-500",
      gray: "bg-gray-500 text-white hover:bg-gray-600 focus-visible:ring-gray-500",
      zinc: "bg-zinc-500 text-white hover:bg-zinc-600 focus-visible:ring-zinc-500",
      neutral: "bg-neutral-500 text-white hover:bg-neutral-600 focus-visible:ring-neutral-500",
      stone: "bg-stone-500 text-white hover:bg-stone-600 focus-visible:ring-stone-500",
    },
    outline: {
      primary: "border-2 border-primary-500 text-primary-600 hover:bg-primary-100 focus-visible:ring-primary-500",
      secondary: "border-2 border-secondary-500 text-secondary-600 hover:bg-secondary-100 focus-visible:ring-secondary-500",
      accent: "border-2 border-accent-500 text-accent-600 hover:bg-accent-100 focus-visible:ring-accent-500",
      red: "border-2 border-red-500 text-red-600 hover:bg-red-100 focus-visible:ring-red-500",
      orange: "border-2 border-orange-500 text-orange-600 hover:bg-orange-100 focus-visible:ring-orange-500",
      amber: "border-2 border-amber-500 text-amber-600 hover:bg-amber-100 focus-visible:ring-amber-500",
      yellow: "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-100 focus-visible:ring-yellow-500",
      lime: "border-2 border-lime-500 text-lime-600 hover:bg-lime-100 focus-visible:ring-lime-500",
      green: "border-2 border-green-500 text-green-600 hover:bg-green-100 focus-visible:ring-green-500",
      emerald: "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-100 focus-visible:ring-emerald-500",
      teal: "border-2 border-teal-500 text-teal-600 hover:bg-teal-100 focus-visible:ring-teal-500",
      cyan: "border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-100 focus-visible:ring-cyan-500",
      sky: "border-2 border-sky-500 text-sky-600 hover:bg-sky-100 focus-visible:ring-sky-500",
      blue: "border-2 border-blue-500 text-blue-600 hover:bg-blue-100 focus-visible:ring-blue-500",
      indigo: "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-100 focus-visible:ring-indigo-500",
      violet: "border-2 border-violet-500 text-violet-600 hover:bg-violet-100 focus-visible:ring-violet-500",
      purple: "border-2 border-purple-500 text-purple-600 hover:bg-purple-100 focus-visible:ring-purple-500",
      fuchsia: "border-2 border-fuchsia-500 text-fuchsia-600 hover:bg-fuchsia-100 focus-visible:ring-fuchsia-500",
      pink: "border-2 border-pink-500 text-pink-600 hover:bg-pink-100 focus-visible:ring-pink-500",
      rose: "border-2 border-rose-500 text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-500",
      slate: "border-2 border-slate-500 text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-500",
      gray: "border-2 border-gray-500 text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-500",
      zinc: "border-2 border-zinc-500 text-zinc-600 hover:bg-zinc-100 focus-visible:ring-zinc-500",
      neutral: "border-2 border-neutral-500 text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-500",
      stone: "border-2 border-stone-500 text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-500",
    },
    subtle: {
      primary: "bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500",
      secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus-visible:ring-secondary-500",
      accent: "bg-accent-100 text-accent-700 hover:bg-accent-200 focus-visible:ring-accent-500",
      red: "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
      orange: "bg-orange-100 text-orange-700 hover:bg-orange-200 focus-visible:ring-orange-500",
      amber: "bg-amber-100 text-amber-700 hover:bg-amber-200 focus-visible:ring-amber-500",
      yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500",
      lime: "bg-lime-100 text-lime-700 hover:bg-lime-200 focus-visible:ring-lime-500",
      green: "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500",
      emerald: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus-visible:ring-emerald-500",
      teal: "bg-teal-100 text-teal-700 hover:bg-teal-200 focus-visible:ring-teal-500",
      cyan: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 focus-visible:ring-cyan-500",
      sky: "bg-sky-100 text-sky-700 hover:bg-sky-200 focus-visible:ring-sky-500",
      blue: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500",
      indigo: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus-visible:ring-indigo-500",
      violet: "bg-violet-100 text-violet-700 hover:bg-violet-200 focus-visible:ring-violet-500",
      purple: "bg-purple-100 text-purple-700 hover:bg-purple-200 focus-visible:ring-purple-500",
      fuchsia: "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 focus-visible:ring-fuchsia-500",
      pink: "bg-pink-100 text-pink-700 hover:bg-pink-200 focus-visible:ring-pink-500",
      rose: "bg-rose-100 text-rose-700 hover:bg-rose-200 focus-visible:ring-rose-500",
      slate: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-500",
      gray: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500",
      zinc: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 focus-visible:ring-zinc-500",
      neutral: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus-visible:ring-neutral-500",
      stone: "bg-stone-100 text-stone-700 hover:bg-stone-200 focus-visible:ring-stone-500",
    },
    ghost: {
      primary: "text-primary-600 hover:bg-primary-100 focus-visible:ring-primary-500",
      secondary: "text-secondary-600 hover:bg-secondary-100 focus-visible:ring-secondary-500",
      accent: "text-accent-600 hover:bg-accent-100 focus-visible:ring-accent-500",
      red: "text-red-600 hover:bg-red-100 focus-visible:ring-red-500",
      orange: "text-orange-600 hover:bg-orange-100 focus-visible:ring-orange-500",
      amber: "text-amber-600 hover:bg-amber-100 focus-visible:ring-amber-500",
      yellow: "text-yellow-600 hover:bg-yellow-100 focus-visible:ring-yellow-500",
      lime: "text-lime-600 hover:bg-lime-100 focus-visible:ring-lime-500",
      green: "text-green-600 hover:bg-green-100 focus-visible:ring-green-500",
      emerald: "text-emerald-600 hover:bg-emerald-100 focus-visible:ring-emerald-500",
      teal: "text-teal-600 hover:bg-teal-100 focus-visible:ring-teal-500",
      cyan: "text-cyan-600 hover:bg-cyan-100 focus-visible:ring-cyan-500",
      sky: "text-sky-600 hover:bg-sky-100 focus-visible:ring-sky-500",
      blue: "text-blue-600 hover:bg-blue-100 focus-visible:ring-blue-500",
      indigo: "text-indigo-600 hover:bg-indigo-100 focus-visible:ring-indigo-500",
      violet: "text-violet-600 hover:bg-violet-100 focus-visible:ring-violet-500",
      purple: "text-purple-600 hover:bg-purple-100 focus-visible:ring-purple-500",
      fuchsia: "text-fuchsia-600 hover:bg-fuchsia-100 focus-visible:ring-fuchsia-500",
      pink: "text-pink-600 hover:bg-pink-100 focus-visible:ring-pink-500",
      rose: "text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-500",
      slate: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-500",
      gray: "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-500",
      zinc: "text-zinc-600 hover:bg-zinc-100 focus-visible:ring-zinc-500",
      neutral: "text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-500",
      stone: "text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-500",
    },
  };

  return twMerge(
    clsx(
      base,
      sizes[size],
      variants[variant][color],
      props.class,
    ),
  );
});

const elementAttributes = computed(() => {
  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.target === "_blank" ? "noopener noreferrer" : undefined,
    };
  }
  return {
    ...attrs,
    id: props.id || undefined,
    type: props.type || "button",
    disabled: props.disabled,
  };
});

const Element = props.href ? "a" : "button";
</script>

<template>
  <component
    :is="Element"
    :class="buttonClasses"
    v-bind="elementAttributes"
  >
    <slot name="left-icon" />
    <slot />
    <slot name="right-icon" />
  </component>
</template>
