<script setup lang="ts">
import { navigate } from "astro:transitions/client";
import { ref } from "vue";

import type { UIColor, UISize, UIVariant } from "@/types";
import type { PaginationReturn } from "@/utils/pagination";

import Button from "@/ui/Button.vue";

type Pagination = {
  currentPage: number;
  pageData: Omit<PaginationReturn<unknown>, "items">;
  targetURL: string;
  color?: UIColor;
  size?: UISize;
  variant?: UIVariant;
  class?: string;
};

const props = withDefaults(defineProps<Pagination>(), {
  color: "primary",
  size: "md",
  variant: "solid",
});

const sizes = {
  xs: "h-7",
  sm: "h-8",
  md: "h-24",
  lg: "h-11",
  xl: "h-12",
};

const pageInput = ref<number | null>(null);

function handleInput() {
  if (pageInput.value && pageInput.value > props.pageData.totalPages) {
    pageInput.value = props.pageData.totalPages;
  }
}
</script>

<template>
  <div class="flex items-center">
    <Button
      class="rounded-tl-md rounded-bl-md"
      :color="color"
      :size="size"
      :variant="variant"
      :disabled="!props.pageData.hasPrev"
      @click="navigate(`/${targetURL}?page=${currentPage - 1}`)"
    >
      <span>«</span>
    </Button>

    <label class="border border-primary-200 max-w-32 focus-within:border-primary-300" :class="sizes[props.size]">
      <span class="sr-only">Current Page Number</span>
      <input
        v-model.number="pageInput"
        type="number"
        name="pageInput"
        class="content-center text-sm font-medium text-center bg-transparent size-full placeholder:text-font focus:placeholder:opacity-0 outline-0"
        :placeholder="String(currentPage)"
        @keyup="handleInput"
        @keyup.enter="navigate(`/${targetURL}?page=${pageInput}`)"
      >
    </label>

    <Button
      class="rounded-tr-md rounded-br-md"
      :color="color"
      :size="size"
      :variant="variant"
      :disabled="!props.pageData.hasNext"
      @click="navigate(`/${targetURL}?page=${currentPage + 1}`)"
    >
      <span>»</span>
    </Button>
  </div>
</template>
