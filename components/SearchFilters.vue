<template>
  <div class="bg-white rounded-lg shadow p-4">
    <input
      v-model="store.filters.searchText"
      type="text"
      placeholder="Search by name..."
      class="w-full px-4 py-2 border rounded-lg mb-4"
    />
    
    <div class="space-y-4">
      <div>
        <label class="block mb-2">Gender</label>
        <select
          v-model="store.filters.gender"
          class="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="flex items-center">
        <input
          v-model="store.filters.favoritesOnly"
          type="checkbox"
          class="mr-2"
        />
        <label>Show favorites only</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/users';

const store = useUserStore();
</script>