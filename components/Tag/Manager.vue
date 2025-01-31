<template>
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold mb-4">Tags</h3>
      
      <!-- Add new tag -->
      <div class="flex space-x-2 mb-4">
        <input
          v-model="newTag"
          type="text"
          placeholder="New tag..."
          class="flex-1 px-3 py-2 border rounded-lg"
          @keyup.enter="addTag"
        />
        <button
          @click="addTag"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          :disabled="!newTag.trim()"
        >
          Add
        </button>
      </div>
  
      <!-- Tag list -->
      <div v-if="store.hydrated">
        <div
          v-for="tag in store.tags"
          :key="tag"
          class="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
          <span v-if="editingTag !== tag">{{ tag }}</span>
          <input
            v-else
            v-model="editedTagName"
            type="text"
            class="px-2 py-1 border rounded"
            @keyup.enter="updateTag(tag)"
            @keyup.esc="cancelEdit"
          />
          
          <div class="flex space-x-2">
            <button
              v-if="editingTag !== tag"
              @click="startEdit(tag)"
              class="text-blue-500 hover:text-blue-600 cursor-pointer">
              Edit
            </button>
            <button
              v-else
              @click="updateTag(tag)"
              class="text-green-500 hover:text-green-600 cursor-pointer">
              Save
            </button>
            <button
              @click="removeTag(tag)"
              class="text-red-500 hover:text-red-600 cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useUserStore } from '@/store/users';
  
  const store = useUserStore();
  const newTag = ref('');
  const editingTag = ref('');
  const editedTagName = ref('');
  
  const addTag = () => {
    const trimmedTag = newTag.value.trim();
    if (trimmedTag) {
      store.addTag(trimmedTag);
      newTag.value = '';
    }
  };
  
  const startEdit = (tag: string) => {
    editingTag.value = tag;
    editedTagName.value = tag;
  };
  
  const cancelEdit = () => {
    editingTag.value = '';
    editedTagName.value = '';
  };
  
  const updateTag = (oldTag: string) => {
    const trimmedTag = editedTagName.value.trim();
    if (trimmedTag && trimmedTag !== oldTag) {
      store.updateTag(oldTag, trimmedTag);
    }
    cancelEdit();
  };
  
  const removeTag = (tag: string) => {
    if (confirm(`Are you sure you want to delete the tag "${tag}"?`)) {
      store.removeTag(tag);
    }
  };
  </script>