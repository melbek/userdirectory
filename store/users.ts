import { defineStore } from 'pinia'
import type { User } from '@/types/user'

/**
 * Pinia store for managing user data, including user list, filters, tags, and persistence.
 * Provides functionality for user management, filtering, tagging, and state persistence.
 *
 * @example
 * ```typescript
 * const store = useUserStore();
 * 
 * // Fetch users
 * await store.fetchUsers();
 * 
 * // Apply filters
 * store.filters.searchText = 'John';
 * store.filters.favoritesOnly = true;
 * 
 * // Work with filtered users
 * const filteredUsers = store.filteredUsers;
 * ```
 */
export const useUserStore = defineStore('users', {
  /**
   * Store state definition.
   * Initializes all required state properties with their default values.
   */
  state: () => ({
    /** Currently selected user for detailed view */
    users: [] as User[],
    /** Currently selected user for detailed view */
    selectedUser: null as User | null,
    /** Active filters for user list */
    filters: {
      searchText: '',
      gender: null as string | null,
      favoritesOnly: false,
    },
    /** Available tags for user categorization */
    tags: [] as string[],
    /** Current page number for pagination */
    page: 1,
    /** Loading state indicator */
    loading: false,
    /** Error message if any operation fails */
    error: null as string | null,
    /** Flag indicating if store has been initialized from storage */
    hydrated: false,
  }),

  actions: {
    /**
     * Persists current state to localStorage.
     * Saves filters, users, tags, and selected user.
     */
    persistState() {
      try {
        const stateToSave = {
          filters: this.filters,
          users: this.users,
          tags: this.tags,
          selectedUserId: this.selectedUser?.id || null,
        };
        const { saveState } = useLocalStorage()
        saveState('userPreferences', stateToSave)
      } catch (error) {
        console.error('Error saving state to localStorage:', error);
      }
    },

    /**
     * Initializes store state from localStorage.
     * Restores filters, tags, and selected user if available.
     */
    initializeFromStorage() {
      const { loadState } = useLocalStorage()
      const savedState = loadState('userPreferences')
      
      if (savedState) {
        // Restore tags and filters
        this.users = savedState.users || [];
        this.tags = savedState.tags || []
        if (savedState.filters) {
          this.filters.searchText = savedState.filters.searchText;
          this.filters.gender = savedState.filters.gender;
          this.filters.favoritesOnly = savedState.filters.favoritesOnly;
        }
        // Restore selected user if it exists in current users
        if (savedState.selectedUserId) {
          this.selectedUser = this.users.find(u => u.id === savedState.selectedUserId) || null;
        }
      }
      this.hydrated = true;
    },

    /**
     * Fetches next page of users and merges with existing list.
     * Maintains favorite status and tags across fetches.
     */
    async fetchUsers() {
      if (this.loading) return

      this.loading = true
      this.error = null

      try {
        const { fetchUsers } = useApi()
        const newUsers = await fetchUsers(this.page)
        
        // Restore favorite status and tags for existing users
        const { loadState } = useLocalStorage()
        const savedState = loadState('userPreferences')
        
        // Process new users and restore their saved state
        const processedUsers = newUsers.map(user => {
          const savedUser = savedState?.users?.find((u: User) => u.id === user.id)
          return {
            ...user,
            isFavorite: savedUser?.isFavorite || false,
            tags: savedUser?.tags || [],
          }
        })

        this.users = [...this.users, ...processedUsers]
        this.page += 1
        this.persistState()
      } catch (error) {
        this.error = 'Failed to fetch users. Please try again later.'
        console.error('Error in fetchUsers:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Sets the currently selected user for detailed view.
     * @param {User} user - The user to select
     */
    setSelectedUser(user: User) {
      this.selectedUser = user;
    },

    /**
     * Toggles favorite status for a user and persists the change.
     * @param {string} userId - ID of the user to toggle
     */
    toggleFavorite(userId: string) {
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.isFavorite = !user.isFavorite
        this.persistState()
      }
    },

    /**
     * Toggles a tag for a specific user.
     * @param {string} userId - ID of the user
     * @param {string} tag - Tag to toggle
     */
    toggleUserTag(userId: string, tag: string) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        const tagIndex = user.tags.indexOf(tag);
        if (tagIndex === -1) {
          // Add tag
          user.tags.push(tag);
        } else {
          // Remove tag
          user.tags.splice(tagIndex, 1);
        }
        
        this.persistState()
      }
    },

    /**
     * Adds a tag to a user and to global tags if new.
     * @param {string} userId - ID of the user
     * @param {string} tag - Tag to add
     */
    addTagToUser(userId: string, tag: string) {
      const user = this.users.find(u => u.id === userId);
      if (user && !user.tags.includes(tag)) {
        user.tags.push(tag);
        
        // Add to global tags if it's a new tag
        if (!this.tags.includes(tag)) {
          this.tags.push(tag);
        }
        
        this.persistState()
      }
    },

    /**
     * Removes a tag from a specific user.
     * @param {string} userId - ID of the user
     * @param {string} tag - Tag to remove
     */
    removeTagFromUser(userId: string, tag: string) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        const tagIndex = user.tags.indexOf(tag);
        if (tagIndex !== -1) {
          user.tags.splice(tagIndex, 1);
          
          this.persistState()
        }
      }
    },

    /**
     * Adds a new tag to the global tag list.
     * @param {string} tag - Tag to add
     */
    addTag(tag: string) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        this.persistState()
      }
    },

    /**
     * Removes a tag from the global list and all users.
     * @param {string} tag - Tag to remove
     */
    removeTag(tag: string) {
      const index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
        // Update all users that had this tag
        this.users.forEach(user => {
          user.tags = user.tags.filter(t => t !== tag);
        });
        this.persistState()
      }
    },

    /**
     * Updates a tag name globally and in all users.
     * @param {string} oldTag - Current tag name
     * @param {string} newTag - New tag name
     */
    updateTag(oldTag: string, newTag: string) {
      const index = this.tags.indexOf(oldTag);
      if (index > -1) {
        this.tags[index] = newTag;
        // Update all users that had the old tag
        this.users.forEach(user => {
          const tagIndex = user.tags.indexOf(oldTag);
          if (tagIndex > -1) {
            user.tags[tagIndex] = newTag;
          }
        });
        this.persistState()
      }
    },

  },

  getters: {
    /**
     * Returns filtered users based on current filters.
     * Applies text search, gender filter, and favorites filter.
     * @returns {User[]} Filtered list of users
     */
    filteredUsers(): User[] {
      return this.users.filter(user => {
        const matchesSearch = this.filters.searchText
          ? `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(this.filters.searchText.toLowerCase())
          : true;

        const matchesGender = this.filters.gender
          ? user.gender === this.filters.gender
          : true;

        const matchesFavorites = this.filters.favoritesOnly
          ? user.isFavorite
          : true;

        return matchesSearch && matchesGender && matchesFavorites;
      });
    },

    /**
     * Returns unique list of all available tags.
     * @returns {string[]} Array of unique tags
     */
    allTags(): string[] {
      return [...new Set(this.tags)];
    }
  },
})