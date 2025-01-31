<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Contact Header -->
    <div class="flex justify-between items-start mb-6">
      <div class="flex items-center space-x-4">
        <img
          :src="user.picture"
          :alt="`${user.firstName} ${user.lastName}`"
          class="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 class="text-2xl font-bold">
            {{ user.firstName }} {{ user.lastName }}
          </h2>
          <p class="text-gray-600">ID: {{ user.id }}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 gap-3">
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <button
          @click.stop="store.toggleFavorite(user.id)"
          class="text-yellow-500 hover:text-yellow-600 text-2xl">
          <span v-if="user.isFavorite">★</span>
          <span v-else>☆</span>
        </button>
      </div>
    </div>

    <!-- Contact Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="font-semibold mb-2">Contact Information</h3>
        <div>
          <p class="mb-2"><span class="text-gray-600">Email:</span> {{ user.email }}</p>
          <p><span class="text-gray-600">Phone:</span> {{ user.phone }}</p>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Location</h3>
        <div>
          <p class="mb-2"><span class="text-gray-600">Country:</span> {{ user.location.country }}</p>
          <p class="mb-2"><span class="text-gray-600">City:</span> {{ user.location.city }}</p>
          <p class="mb-2"><span class="text-gray-600">Street:</span> {{ user.location.street }}</p>
          <p><span class="text-gray-600">Postcode:</span> {{ user.location.postcode }}</p>
        </div>
      </div>
    </div>

    <!-- Tag List -->
    <div class="mt-6">
      <h3 class="font-semibold mb-2">Tags</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in user.tags"
          :key="tag"
          class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
        >
          {{ tag }}
        </span>
        <button
          @click="showTagModal = true"
          class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
        >
          + Add Tag
        </button>
      </div>
    </div>

    <!-- Tag Modal -->
    <Teleport to="body">
      <TagModal
        v-if="showTagModal"
        :user="user"
        :available-tags="store.allTags"
        @close="showTagModal = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/users';
import type { User } from '@/types/user';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useUserStore();
const showTagModal = ref(false);
</script>