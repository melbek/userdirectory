<template>
  <div class="container mx-auto p-4" v-if="store.hydrated">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Search Filters -->
      <div class="lg:col-span-1">
        <SearchFilters />
        <TagManager class="mt-4" />
      </div>

      <!-- User List -->
      <div class="lg:col-span-2">
        <div v-if="store.selectedUser">
          <UserDetail :user="store.selectedUser" @close="store.selectedUser = null" />
        </div>
        <div v-else>
          <UserList @select-user="handleUserSelect" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/users';
import type { User } from '@/types/user';

const store = useUserStore();

const handleUserSelect = (user: User) => {
  store.selectedUser = user;
};
</script>