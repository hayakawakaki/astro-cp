<script setup lang="ts">
import type { Session } from "better-auth/types";

import { onMounted, ref } from "vue";

import { authService } from "@lib/auth/auth-client";

const session = ref<Session | null>(null);

async function loadSession() {
  session.value = await authService.useSession();
}

onMounted(loadSession);

async function onDiscordSignIn() {
  await authService.signIn("discord");
  // Refresh session after sign in
  await loadSession();
}

async function signOut() {
  await authService.signOut();
  // Clear session after sign out
  session.value = null;
}
</script>

<template>
  <button v-if="!session" class="btn btn-md" @click="onDiscordSignIn">
    Sign In
  </button>
  <button v-if="session" class="btn btn-md" @click="signOut">
    Sign Out
  </button>
</template>
