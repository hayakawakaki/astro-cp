<script setup lang="ts">
import { ref } from "vue";

import Button from "@/ui/Button.vue";

const props = defineProps<{ class?: string }>();

async function onHandleSubmit(): Promise<void> {

}

const email = ref("");
</script>

<template>
  <form class="h-full flex flex-col justify-center items-center" :class="props" @submit.prevent="onHandleSubmit">
    <input v-model="email" type="email" name="email" placeholder="Email" required autocomplete="email">
    <label for="email" class="sr-only">
      Email
    </label>
    <Button type="submit" variant="solid">
      Login with Email
    </Button>
  </form>
</template>
