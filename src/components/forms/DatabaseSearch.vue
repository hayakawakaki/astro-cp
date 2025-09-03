<script setup lang="ts" generic="T extends Record<string, any>">
import type { VNode } from "vue";

import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import { ref, watch } from "vue";

// Types
type SearchProps = {
  id: string;
  endpoint: string;
  baseURL: string;
  placeholder?: string;
  minChars?: number;
  maxResults?: number;
  inputClass?: string;
  dropDownClass?: string;
};

type Slots<T> = {
  display: (props: { item: T }) => VNode[];
};

const props = withDefaults(defineProps<SearchProps>(), {
  placeholder: "Search",
  minChars: 3,
  maxResults: 5,
});

defineSlots<Slots<T>>();

const dropdownRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>();
const inputData = ref<string>("");
const results = ref<T[]>([]);
const isOpen = ref<boolean>(false);
const selectedIndex = ref<number>();

onClickOutside(dropdownRef, () => {
  if (isOpen.value) {
    inputData.value = "";
    isOpen.value = false;
    results.value = [];
  }
});

const debounce = useDebounceFn(async () => {
  if (!inputData.value) {
    isOpen.value = false;
    results.value = [];
    return;
  }

  if (inputData.value.length < props.minChars)
    return;

  try {
    const res = await fetch(`${props.endpoint}?q=${encodeURIComponent(inputData.value)}&limit=${props.maxResults}`);
    const data = await res.json();
    results.value = data;
  }
  catch (err) {
    results.value = [];
    console.error("Search Failed :", err);
  }
  finally {
    isOpen.value = true;
  }
}, 300);

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value)
    return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(
        (selectedIndex.value ?? -1) + 1,
        results.value.length - 1,
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max((selectedIndex.value ?? 0) - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value !== undefined && selectedIndex.value >= 0 && results.value[selectedIndex.value]) {
        navigate(`${props.baseURL}/${results.value[selectedIndex.value].id}`);
      }
      break;
    case "Escape":
      isOpen.value = false;
      selectedIndex.value = undefined;
      break;
  }
}

watch(inputData, debounce);
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <label
      class="flex items-center px-2 border rounded-md gap-x-2 border-primary-200 focus-within:outline-1 focus-within:outline-primary-300"
      :class="inputClass"
    >
      <span class="sr-only">{{ props.placeholder }}</span>
      <svg
        class="h-4 opacity-50 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        @click="inputRef?.focus()"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
        />
      </svg>
      <input
        ref="inputRef"
        v-model="inputData"
        class="text-sm font-medium bg-transparent outline-none size-full md:text-base placeholder:font-medium"
        type="search"
        :placeholder="props.placeholder"
        @keydown="onKeydown"
      >
    </label>

    <div v-show="isOpen" class="absolute mt-1 border rounded-md z-90 w-80 bg-background border-primary-200">
      <ul v-if="results.length > 0" class="overflow-auto">
        <li v-for="(item, index) in results" :key="index">
          <button
            class="flex items-center justify-between w-full p-2 text-sm text-right transition-colors hover:bg-secondary-200"
            :class="{ 'bg-secondary-200': selectedIndex === index }"
            type="button"
            @click="navigate(`${baseURL}/${(item as T)['id' as keyof T]}`)"
            @mouseenter="selectedIndex = index"
          >
            <slot name="display" :item="(item as T)">
              <span>{{ `#${(item as T)["id" as keyof T]}` }}</span>
              <span>{{ (item as T)["name" as keyof T] }}</span>
            </slot>
          </button>
        </li>
      </ul>
      <div v-else class="p-2 text-sm text-gray-500">
        No result found.
      </div>
    </div>
  </div>
</template>
