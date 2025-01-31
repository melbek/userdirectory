<!-- components/TagModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Manage Tags</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <!-- Add new tag -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Add New Tag
        </label>
        <div class="flex space-x-2">
          <input
            v-model="newTag"
            type="text"
            placeholder="Enter new tag..."
            class="flex-1 px-3 py-2 border rounded-lg"
            @keyup.enter="handleAddTag"
          />
          <button
            @click="handleAddTag"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            :disabled="!newTag.trim()"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Existing tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Available Tags
        </label>
        <div class="max-h-60 overflow-y-auto">
          <div
            v-for="tag in availableTags"
            :key="tag"
            class="flex items-center justify-between p-2 mb-2 hover:bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="isTagSelected(tag)"
                @change="toggleTag(tag)"
                class="mr-2"
              />
              <span>{{ tag }}</span>
            </div>
            <span class="text-xs text-gray-500">
              {{ isTagSelected(tag) ? 'Added' : '' }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/users';
import type { User } from '@/types/user';

const props = defineProps<{
  user: User;
  availableTags: string[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useUserStore();
const newTag = ref('');

const isTagSelected = (tag: string) => {
  return props.user.tags.includes(tag);
};

const toggleTag = (tag: string) => {
  store.toggleUserTag(props.user.id, tag);
};

const handleAddTag = () => {
  const trimmedTag = newTag.value.trim();
  if (trimmedTag) {
    store.addTag(trimmedTag);
    store.addTagToUser(props.user.id, trimmedTag);
    newTag.value = '';
  }
};
</script>