<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink 
              to="/" 
              class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
              :class="{ 'text-blue-600': route.path === '/' }">
              Users
            </NuxtLink>
            <NuxtLink 
              to="/statistics" 
              class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
              :class="{ 'text-blue-600': route.path === '/statistics' }">
              Statistics
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>