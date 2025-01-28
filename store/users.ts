import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    filters: {
      searchText: '',
      gender: null as string | null,
      favoritesOnly: false,
    },
    tags: [] as string[],
    page: 1,
    loading: false,
    error: null as string | null,
    hydrated: false, // New flag to indicate when initialization is complete
  }),

  actions: {
    // Persist current state in localStorage
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

    // Initialize store from localStorage
    initializeFromStorage() {
      const { loadState } = useLocalStorage()
      const savedState = loadState('userPreferences')
      
      if (savedState) {
        this.tags = savedState.tags || []
        if (savedState.filters) {
          this.filters.searchText = savedState.filters.searchText;
          this.filters.gender = savedState.filters.gender;
          this.filters.favoritesOnly = savedState.filters.favoritesOnly;
        }
        if (savedState.selectedUserId) {
          this.selectedUser = this.users.find(u => u.id === savedState.selectedUserId) || null;
        }
        //this.users = savedState.users || []
      }
      this.hydrated = true;
    },

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

    setSelectedUser(user: User) {
      this.selectedUser = user;
    },

    // Updated action to persist changes
    toggleFavorite(userId: string) {
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.isFavorite = !user.isFavorite
        this.persistState()
      }
    },

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

    // Add tag to a user
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

    addTag(tag: string) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        this.persistState()
      }
    },

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

    allTags(): string[] {
      return [...new Set(this.tags)];
    }
  },
})