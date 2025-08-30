<script setup lang="ts">
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs } from "vue";

type ButtonBase = {
  variant?: "solid" | "outline" | "subtle";
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  class?: string;
};

type Button
  = ButtonBase & {
    href?: string;
    action?: never;
    disabled?: never;
    type?: never;
    target?: "_blank" | "_self" | "_parent" | "_top";
  }
  | ButtonBase & {
    href?: never;
    action?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    target?: never;
  };

// capture non-props attributes, maybe for aria? or custom hovers
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Button>(), {
  variant: "solid",
  color: "primary",
  size: "md",
});

const attrs = useAttrs();

const buttonClasses = computed(() => {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

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
      info: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500",
      success: "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500",
      warning: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
      error: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
    },
    outline: {
      primary: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500",
      secondary: "border-2 border-secondary-500 text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500",
      accent: "border-2 border-accent-500 text-accent-600 hover:bg-accent-50 focus-visible:ring-accent-500",
      info: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500",
      success: "border-2 border-green-500 text-green-600 hover:bg-green-50 focus-visible:ring-green-500",
      warning: "border-2 border-amber-500 text-amber-600 hover:bg-amber-50 focus-visible:ring-amber-500",
      error: "border-2 border-red-500 text-red-600 hover:bg-red-50 focus-visible:ring-red-500",
    },
    subtle: {
      primary: "bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500",
      secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus-visible:ring-secondary-500",
      accent: "bg-accent-100 text-accent-700 hover:bg-accent-200 focus-visible:ring-accent-500",
      info: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500",
      success: "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500",
      warning: "bg-amber-100 text-amber-700 hover:bg-amber-200 focus-visible:ring-amber-500",
      error: "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
    },
  };

  return twMerge(
    clsx(
      base,
      sizes[props.size],
      variants[props.variant][props.color],
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
    type: props.type || "button",
    disabled: props.disabled,
  };
});

const Element = props.href ? "a" : "button";

function onClick() {
  if (!props.href && props.action) {
    props.action();
  }
}
</script>

<template>
  <component
    :is="Element"
    :class="buttonClasses"
    v-bind="elementAttributes"
    @click="onClick"
  >
    <slot name="left-icon" />
    <slot />
    <slot name="right-icon" />
  </component>
</template>
