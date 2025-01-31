<template>
  <div v-if="store.hydrated" >
    <!-- Error Alert -->
    <div
      v-if="store.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert">
      <span class="block sm:inline">{{ store.error }}</span>
      <button
        @click="store.error = null"
        class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <span class="sr-only">Close</span>
        <span class="text-xl">&times;</span>
      </button>
    </div>
    
    <!-- User List Container -->
    <div class="space-y-4">
      <div
        v-for="user in store.filteredUsers"
        :key="user.id"
        class="bg-white rounded-lg shadow p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        @click="$emit('select-user', user)">
        <div class="flex items-center space-x-4">
          <img
            :src="user.thumbnail"
            :alt="`${user.firstName} ${user.lastName}`"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                {{ user.firstName }} {{ user.lastName }}
              </h3>
              <button
                @click.stop="store.toggleFavorite(user.id)"
                class="text-yellow-500 hover:text-yellow-600">
                <span v-if="user.isFavorite">★</span>
                <span v-else>☆</span>
              </button>
            </div>
            <p class="text-gray-600">{{ user.email }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="tag in user.tags"
                :key="tag"
                class="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="store.loading"
      class="flex justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <div
      v-if="!store.loading && store.users.length === 0"
      class="text-center p-4 text-gray-500">
      No users found
    </div>
  </div>
  <div ref="intersectionTarget" class="h-4 w-full text-center p-5">
    <button 
      v-if="!store.loading"
      @click="store.fetchUsers()"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          More results...
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/store/users';
import type { User } from '@/types/user';

const store = useUserStore();

const emit = defineEmits<{
  (event: 'select-user', value: User): void;
}>();

// Infinite scroll implementation
const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottomPosition = document.documentElement.offsetHeight;
  if (scrollPosition + 200 >= bottomPosition) {
    //store.fetchUsers();
  }
};

onMounted(() => {
  if (store.users.length === 0) {
    store.fetchUsers();
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>