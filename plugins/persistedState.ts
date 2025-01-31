import { defineNuxtPlugin } from '#app'
import { useUserStore } from '@/store/users'
import { debounce } from 'lodash-es';

export default defineNuxtPlugin(async () => {
  const store = useUserStore()
  // Initialize store from localStorage
  await store.initializeFromStorage();

  // Watch for changes and save to localStorage
  watch(
    () => ({
      filters: store.filters,
      selectedUser: store.selectedUser,
      tags: store.tags,
      page: store.page,
      users: store.users,
    }),
    () => {
      // Debounce the save operation
      debounce(() => store.persistState(), 1000)();
    },
    { deep: true }
  );

  // Save state before unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      store.persistState();
    });
  }
})