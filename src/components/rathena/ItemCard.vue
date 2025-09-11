<script setup lang="ts">
import type { ItemDatabaseFormat } from "@/rathena";

const props = defineProps<{
  itemData?: ItemDatabaseFormat;
  class?: string;
}>();

const itemData = props.itemData;
</script>

<template>
  <article class="p-0.5 border border-gray-200 rounded-md select-none h-max max-w-[20rem] font-[Gulim,Arial]" :class="props.class">
    <div class="relative h-full p-1.5 border border-gray-400/80 rounded-sm overflow-hidden min-w-[278px]">
      <div class="absolute top-0 left-0 z-0 w-full border-b border-gray-400/80">
        <hr v-for="index in 21" :key="`line-${index}`" class="border-0 h-[1px] even:bg-gray-200">
      </div>
      <div class="absolute bottom-0 -right-[37px] flex flex-col w-20 gap-0.5 rotate-135">
        <hr class="border-0 h-[2px] bg-gray-400/80">
        <hr class="border-0 h-[2px] bg-gray-400/80">
        <hr class="border-0 h-[2px] bg-gray-400/80">
      </div>
      <div class="relative flex">
        <div class="shadow-[2px_2px_0] shadow-gray-400/80 size-max shrink-0">
          <img :src="`/images/collection/${itemData?.Image}.webp`" :alt="`${itemData?.Name} Collection`" onerror="this.onerror=null; this.src='/images/collection/unknown.webp'">
        </div>
        <section class="relative px-2 text-[12px] col-span-2 break-keep max-w-[28ch] pt-5.5 pb-1.5">
          <h2 class="absolute -top-[3px] left-[5px] text-shadow-[1px_0_0] text-shadow-white whitespace-nowrap">
            <span>{{ itemData?.ClientName }}</span>
          </h2>
          <p v-for="(description, index) in itemData?.Description" :key="`${itemData?.Id}-desc-${index}`" v-html="description" />
        </section>
      </div>
      <p class="invisible whitespace-nowrap pl-[81px] text-[12px] h-0 overflow-hidden">
        <span>{{ itemData?.ClientName }}</span>
      </p>
    </div>
  </article>
</template>
