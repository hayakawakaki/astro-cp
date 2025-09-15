<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

import type { NavLink } from "@/types";

type Props = {
  label?: string;
  links: NavLink[];
  class?: string;
  arrow?: boolean;
  divide?: boolean;
};

const {
  arrow = false,
  divide = false,
  ...props
} = defineProps<Props>();

const open = ref(false);
const dropdownRef = ref<HTMLElement>();

function toggleOpen() {
  open.value = !open.value;
}

onClickOutside(dropdownRef, () => {
  if (open.value)
    open.value = !open.value;
});
</script>

<template>
  <div ref="dropdownRef" class="relative z-50 inline-block" :class="props.class">
    <button class="flex items-center cursor-pointer" @click="toggleOpen">
      <slot name="label">
        <span>
          {{ label || "Add Default Label" }}
        </span>
      </slot>
      <svg
        v-if="arrow"
        class="h-5 -mx-0.5 duration-200 fill-font"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
      >
        <path d="M480-360 280-560h400L480-360Z" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-show="open"
        class="absolute mt-2 -translate-x-1/2 bg-white border rounded-sm shadow-lg border-primary-200 left-1/2"
        :class="divide && 'divide-primary-200 divide-y'"
        @click="open = false"
      >
        <a
          v-for="link in links"
          :key="link.url"
          :href="link.url"
          :target="link.external ? '_blank' : '_self'"
          class="block px-4 py-2 text-sm transition-colors text-font hover:bg-primary-100 whitespace-nowrap"
        >
          {{ link.label }}
        </a>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
