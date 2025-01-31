import { useUserStore } from '@/store/users'
import { debounce } from 'lodash-es';

/**
 * Creates a Nuxt plugin that handles state persistence for the user store.
 * This plugin automatically saves store state to localStorage when changes occur
 * and restores the state when the application initializes.
 *
 * Features:
 * - Debounced saving to prevent excessive localStorage writes
 * - Automatic state restoration on app initialization
 * - Saves state before page unload
 * - Error handling for failed persistence operations
 *
 * @example
 * // Default usage in nuxt.config.ts
 * export default defineNuxtConfig({
 *   plugins: ['~/plugins/persistedState']
 * })
 *
 * @example
 * // Custom configuration
 * const plugin = createPersistedStatePlugin({
 *   debounceTime: 500,
 *   useStore: customStoreImplementation
 * })
 *
 * @param {Object} options - Configuration options for the plugin
 * @param {number} [options.debounceTime=1000] - Time in milliseconds to debounce save operations
 * @param {Function} [options.useStore=useUserStore] - Function that returns the store instance to be persisted
 * @returns {Plugin} A Nuxt plugin that handles state persistence
 */
export const createPersistedStatePlugin = ({
  debounceTime = 1000,
  useStore = useUserStore
} = {}) => {
  return defineNuxtPlugin(async () => {
    const store = useStore();
    
    // Initialize store state from localStorage
    try {
      await store.initializeFromStorage();
    } catch (error) {
      console.error('Failed to initialize store:', error);
    }

    // Create debounced save function to prevent excessive writes
    const debouncedSave = debounce(() => store.persistState(), debounceTime);

    // Watch for changes in store state
    watch(
      // State properties to watch
      () => ({
        filters: store.filters,
        selectedUser: store.selectedUser,
        tags: store.tags,
        page: store.page,
        users: store.users,
      }),
      // Save state when changes occur (debounced)
      debouncedSave,
      { deep: true }
    );

    // Save state before page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        // Use immediate save instead of debounced version
        store.persistState();
      });
    }
  });
};

export default createPersistedStatePlugin();