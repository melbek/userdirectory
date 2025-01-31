<template>
  <div class="container mx-auto" v-if="store.hydrated">
    <h1 class="text-2xl font-bold mb-6">User Directory</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Search Filters -->
      <div class="lg:col-span-1 block lg:block" :class="{ 'hidden': store.selectedUser != null }">
        <SearchFilters />
        <TagManager class="my-4" />
        <ClientOnly>
          <!-- Prevent hydration errors -->
          <UserList @select-user="handleUserSelect" />
        </ClientOnly>
      </div>

      <!-- User List -->
      <ClientOnly>
        <div class="lg:col-span-2 lg:block" :class="{ 'hidden': store.selectedUser == null }">
          <div v-if="store.selectedUser">
            <UserDetail :user="store.selectedUser" @close="store.selectedUser = null" />
          </div>
          <div v-else>
            <UserDetailsEmpty />
          </div>
        </div>
      </ClientOnly>
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