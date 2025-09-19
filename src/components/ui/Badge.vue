<script setup lang="ts">
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs } from "vue";

import type { UIColor, UISize, UIVariant } from "@/types";

export type DotPosition = "left" | "right";

type BadgeBase = {
  variant?: UIVariant;
  size?: UISize;
  color?: UIColor;
  class?: string;
  id?: string;
};

type Badge = BadgeBase & {
  dot?: true;
  dotColor: UIColor;
  dotPosition: DotPosition;
}
| BadgeBase & {
  dot?: false;
  dotColor?: never;
  dotPosition?: never;
};

defineOptions({
  inheritAttrs: false,
});

const {
  variant = "solid",
  size = "md",
  color = "gray",
  dot = false,
  ...props
} = defineProps<Badge>();

const dotColor = props.dotColor || "green";
const dotPosition = props.dotPosition || "left";

const attrs = useAttrs();

const badgeClasses = computed(() => {
  const base = "inline-flex items-center gap-1.5 rounded-md font-medium";

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-3.5 py-2 text-base",
    xl: "px-4 py-2.5 text-base",
  };

  const variants = {
    solid: {
      primary: "bg-primary-500 text-white",
      secondary: "bg-secondary-500 text-white",
      accent: "bg-accent-500 text-white",
      red: "bg-red-500 text-white",
      orange: "bg-orange-500 text-white",
      amber: "bg-amber-500 text-white",
      yellow: "bg-yellow-500 text-white",
      lime: "bg-lime-500 text-white",
      green: "bg-green-500 text-white",
      emerald: "bg-emerald-500 text-white",
      teal: "bg-teal-500 text-white",
      cyan: "bg-cyan-500 text-white",
      sky: "bg-sky-500 text-white",
      blue: "bg-blue-500 text-white",
      indigo: "bg-indigo-500 text-white",
      violet: "bg-violet-500 text-white",
      purple: "bg-purple-500 text-white",
      fuchsia: "bg-fuchsia-500 text-white",
      pink: "bg-pink-500 text-white",
      rose: "bg-rose-500 text-white",
      slate: "bg-slate-500 text-white",
      gray: "bg-gray-500 text-white",
      zinc: "bg-zinc-500 text-white",
      neutral: "bg-neutral-500 text-white",
      stone: "bg-stone-500 text-white",
    },
    subtle: {
      primary: "bg-primary-100 text-primary-700",
      secondary: "bg-secondary-100 text-secondary-700",
      accent: "bg-accent-100 text-accent-700",
      red: "bg-red-100 text-red-700",
      orange: "bg-orange-100 text-orange-700",
      amber: "bg-amber-100 text-amber-700",
      yellow: "bg-yellow-100 text-yellow-700",
      lime: "bg-lime-100 text-lime-700",
      green: "bg-green-100 text-green-700",
      emerald: "bg-emerald-100 text-emerald-700",
      teal: "bg-teal-100 text-teal-700",
      cyan: "bg-cyan-100 text-cyan-700",
      sky: "bg-sky-100 text-sky-700",
      blue: "bg-blue-100 text-blue-700",
      indigo: "bg-indigo-100 text-indigo-700",
      violet: "bg-violet-100 text-violet-700",
      purple: "bg-purple-100 text-purple-700",
      fuchsia: "bg-fuchsia-100 text-fuchsia-700",
      pink: "bg-pink-100 text-pink-700",
      rose: "bg-rose-100 text-rose-700",
      slate: "bg-slate-100 text-slate-700",
      gray: "bg-gray-100 text-gray-700",
      zinc: "bg-zinc-100 text-zinc-700",
      neutral: "bg-neutral-100 text-neutral-700",
      stone: "bg-stone-100 text-stone-700",
    },
    outline: {
      primary: "border border-primary-500 text-primary-600 bg-transparent",
      secondary: "border border-secondary-500 text-secondary-600 bg-transparent",
      accent: "border border-accent-500 text-accent-600 bg-transparent",
      red: "border border-red-500 text-red-600 bg-transparent",
      orange: "border border-orange-500 text-orange-600 bg-transparent",
      amber: "border border-amber-500 text-amber-600 bg-transparent",
      yellow: "border border-yellow-500 text-yellow-600 bg-transparent",
      lime: "border border-lime-500 text-lime-600 bg-transparent",
      green: "border border-green-500 text-green-600 bg-transparent",
      emerald: "border border-emerald-500 text-emerald-600 bg-transparent",
      teal: "border border-teal-500 text-teal-600 bg-transparent",
      cyan: "border border-cyan-500 text-cyan-600 bg-transparent",
      sky: "border border-sky-500 text-sky-600 bg-transparent",
      blue: "border border-blue-500 text-blue-600 bg-transparent",
      indigo: "border border-indigo-500 text-indigo-600 bg-transparent",
      violet: "border border-violet-500 text-violet-600 bg-transparent",
      purple: "border border-purple-500 text-purple-600 bg-transparent",
      fuchsia: "border border-fuchsia-500 text-fuchsia-600 bg-transparent",
      pink: "border border-pink-500 text-pink-600 bg-transparent",
      rose: "border border-rose-500 text-rose-600 bg-transparent",
      slate: "border border-slate-500 text-slate-600 bg-transparent",
      gray: "border border-gray-500 text-gray-600 bg-transparent",
      zinc: "border border-zinc-500 text-zinc-600 bg-transparent",
      neutral: "border border-neutral-500 text-neutral-600 bg-transparent",
      stone: "border border-stone-500 text-stone-600 bg-transparent",
    },
    ghost: {
      primary: "text-primary-600 bg-transparent",
      secondary: "text-secondary-600 bg-transparent",
      accent: "text-accent-600 bg-transparent",
      red: "text-red-600 bg-transparent",
      orange: "text-orange-600 bg-transparent",
      amber: "text-amber-600 bg-transparent",
      yellow: "text-yellow-600 bg-transparent",
      lime: "text-lime-600 bg-transparent",
      green: "text-green-600 bg-transparent",
      emerald: "text-emerald-600 bg-transparent",
      teal: "text-teal-600 bg-transparent",
      cyan: "text-cyan-600 bg-transparent",
      sky: "text-sky-600 bg-transparent",
      blue: "text-blue-600 bg-transparent",
      indigo: "text-indigo-600 bg-transparent",
      violet: "text-violet-600 bg-transparent",
      purple: "text-purple-600 bg-transparent",
      fuchsia: "text-fuchsia-600 bg-transparent",
      pink: "text-pink-600 bg-transparent",
      rose: "text-rose-600 bg-transparent",
      slate: "text-slate-600 bg-transparent",
      gray: "text-gray-600 bg-transparent",
      zinc: "text-zinc-600 bg-transparent",
      neutral: "text-neutral-600 bg-transparent",
      stone: "text-stone-600 bg-transparent",
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

const dotClasses = computed(() => {
  const dotSizes = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
    xl: "w-3 h-3",
  };

  const dotColors = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    accent: "bg-accent-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    yellow: "bg-yellow-500",
    lime: "bg-lime-500",
    green: "bg-green-500",
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    sky: "bg-sky-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    purple: "bg-purple-500",
    fuchsia: "bg-fuchsia-500",
    pink: "bg-pink-500",
    rose: "bg-rose-500",
    slate: "bg-slate-500",
    gray: "bg-gray-500",
    zinc: "bg-zinc-500",
    neutral: "bg-neutral-500",
    stone: "bg-stone-500",
  };

  return twMerge(
    clsx(
      "rounded-full flex-shrink-0",
      dotSizes[size],
      dotColors[dotColor],
    ),
  );
});

const elementAttributes = computed(() => {
  return {
    ...attrs,
    id: props.id || undefined,
  };
});
</script>

<template>
  <span :class="badgeClasses" v-bind="elementAttributes">
    <slot name="left-icon" />
    <span
      v-if="dot && dotPosition === 'left'"
      :class="dotClasses"
    />
    <slot>
      <span class="content-center">
        Badge
      </span>
    </slot>
    <span
      v-if="dot && dotPosition === 'right'"
      :class="dotClasses"
    />
    <slot name="right-icon" />
  </span>
</template>
