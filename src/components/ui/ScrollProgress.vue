<script setup lang="ts">
import { useScroll } from "@vueuse/core";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { computed, useTemplateRef } from "vue";

import type { UIColor, UISize } from "@/types";

type ScrollProgress = {
  color?: UIColor;
  size?: UISize;
  class?: string;
  id?: string;
  position?: "top" | "bottom";
};

const props = withDefaults(defineProps<ScrollProgress>(), {
  color: "green",
  size: "md",
  position: "top",
});

const scrollContainer = useTemplateRef("scrollContainer");

const { y } = useScroll(scrollContainer);

const scrollProgress = computed(() => {
  if (!scrollContainer.value)
    return 0;

  const element = scrollContainer.value;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  const maxScrollValue = scrollHeight - clientHeight;

  if (maxScrollValue <= 0)
    return 100;

  return Math.min(100, Math.max(0, (y.value / maxScrollValue) * 100));
});

const progressBarClass = computed(() => {
  const base = "fixed left-0 transition-width duration-200 ease-out z-90";
  const position = props.position === "top" ? "top-0" : "bottom-0";

  const sizes = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-2.5",
    xl: "h-3",
  };

  const colors = {
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
      base,
      sizes[props.size],
      colors[props.color],
      position,
    ),
  );
});
</script>

<template>
  <div>
    <div :class="progressBarClass" :style="{ width: `${scrollProgress}%` }" />

    <div ref="scrollContainer" class="overflow-y-auto" :class="props.class">
      <slot />
    </div>
  </div>
</template>
