<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <img src="@/assets/img/logo.svg" alt="Logo" class="h-auto mr-4 hidden sm:block" />
            <NuxtLink
              v-for="item in menuNavigation"
              :key="item.name"
              :to="item.url" 
              class="flex items-center px-4 py-2"
              :class="[route.path == item.url ? 'text-blue-600 hover:text-blue-900' : 'text-gray-700 hover:text-gray-900']">
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>