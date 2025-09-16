<script setup lang="ts">
import { ref } from "vue";

import { signIn } from "@/lib/auth/auth-client";
import Button from "@/ui/Button.vue";
import config from "~/app-config";

const providers = config.AuthProviders;

// TODO find astro icon provider
const iconColors = ref(["bg-blue-500 hover:bg-blue-700", "bg-white border border-gray-300 hover:bg-gray-100", "bg-black"]);
</script>

<template>
  <div class="w-full px-4 md:px-0">
    <div class="relative space-y-4 border border-primary-200 rounded-2xl p-4 md:w-[30rem] lg:w-[32rem] xl:w-[36rem] mx-auto">
      <h2 class="content-center h-16 text-2xl font-medium text-center bg-primary-100 rounded-xl">
        Login
      </h2>
      <div class="flex items-center justify-center gap-4 md:gap-8">
        <template v-for="(item, index) in providers" :key="item.provider">
          <Button class="p-2 rounded-full size-14" :class="iconColors[index]" color="neutral" @click="signIn(item.provider)">
            <component :is="item.icon" />
          </Button>
        </template>
      </div>
      <Button class="absolute right-0 -bottom-8 text-md" size="sm" variant="ghost" href="/">
        Return Home >
      </Button>
    </div>
  </div>
</template>
