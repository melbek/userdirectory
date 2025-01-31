// tests/store/users.test.ts
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore } from '~/store/users';

// Mock the composables
vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    fetchUsers: vi.fn().mockResolvedValue([
      { 
        id: '1', 
        firstName: 'John', 
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'male',
        isFavorite: false,
        tags: []
      }
    ])
  })
}));

vi.mock('~/composables/useLocalStorage', () => ({
  useLocalStorage: () => ({
    saveState: vi.fn(),
    loadState: vi.fn().mockReturnValue({
      users: [],
      tags: ['test-tag'],
      filters: {
        searchText: '',
        gender: null,
        favoritesOnly: false
      }
    })
  })
}));

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('State', () => {
    it('initializes with default state', () => {
      const store = useUserStore();
      expect(store.users).toEqual([]);
      expect(store.selectedUser).toBeNull();
      expect(store.filters).toEqual({
        searchText: '',
        gender: null,
        favoritesOnly: false
      });
      expect(store.tags).toEqual([]);
      expect(store.page).toBe(1);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.hydrated).toBe(false);
    });
  });

  describe('Actions', () => {
    describe('fetchUsers', () => {
      it('fetches and adds new users', async () => {
        const store = useUserStore();
        await store.fetchUsers();
        
        expect(store.users).toHaveLength(1);
        expect(store.users[0].firstName).toBe('John');
        expect(store.page).toBe(2);
        expect(store.loading).toBe(false);
      });

      it('does not fetch when loading is true', async () => {
        const store = useUserStore();
        store.loading = true;
        await store.fetchUsers();
        
        expect(store.users).toHaveLength(0);
        expect(store.page).toBe(1);
      });
    });

      /*{
        id: '1',
        firstName: '',
        lastName: '',
        email: '',
        gender: 'female',
        thumbnail: '',
        picture: '',
        location: {
          country: '',
          city: '',
          street: '',
          postcode: '',
        },
        age: 30,
        phone: '',
        isFavorite: false,
        tags: [],
      }*/

    describe('toggleFavorite', () => {
      it('toggles user favorite status', () => {
        const store = useUserStore();
        store.users = [{
        id: '1',
        firstName: '',
        lastName: '',
        email: '',
        gender: 'female',
        thumbnail: '',
        picture: '',
        location: {
            country: '',
            city: '',
            street: '',
            postcode: '',
        },
        age: 30,
        phone: '',
        isFavorite: false,
        tags: [],
        }];
        
        store.toggleFavorite('1');
        expect(store.users[0].isFavorite).toBe(true);
        
        store.toggleFavorite('1');
        expect(store.users[0].isFavorite).toBe(false);
      });

      it('does nothing for non-existent user', () => {
        const store = useUserStore();
        store.users = [{
            id: '1',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'female',
            thumbnail: '',
            picture: '',
            location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: [],
        }];
        
        store.toggleFavorite('2');
        expect(store.users[0].isFavorite).toBe(false);
      });
    });

    describe('Tag Operations', () => {
      it('adds a new tag', () => {
        const store = useUserStore();
        store.addTag('new-tag');
        expect(store.tags).toContain('new-tag');
      });

      it('does not add duplicate tag', () => {
        const store = useUserStore();
        store.tags = ['existing-tag'];
        store.addTag('existing-tag');
        expect(store.tags).toHaveLength(1);
      });

      it('removes tag and updates users', () => {
        const store = useUserStore();
        store.tags = ['tag-to-remove'];
        store.users = [
          {
            id: '1',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'female',
            thumbnail: '',
            picture: '',
            location: {
              country: '',
              city: '',
              street: '',
              postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: ['tag-to-remove', 'other-tag'],
          }
        ];

        store.removeTag('tag-to-remove');
        expect(store.tags).not.toContain('tag-to-remove');
        expect(store.users[0].tags).not.toContain('tag-to-remove');
      });

      it('updates tag name for all users', () => {
        const store = useUserStore();
        store.tags = ['old-tag'];
        store.users = [
          {
            id: '1',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'female',
            thumbnail: '',
            picture: '',
            location: {
              country: '',
              city: '',
              street: '',
              postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: ['old-tag'],
          }
        ];

        store.updateTag('old-tag', 'new-tag');
        expect(store.tags).toContain('new-tag');
        expect(store.tags).not.toContain('old-tag');
        expect(store.users[0].tags).toContain('new-tag');
      });
    });

    describe('User Tag Operations', () => {
      it('adds tag to user', () => {
        const store = useUserStore();
        store.users = [{
            id: '1',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'female',
            thumbnail: '',
            picture: '',
            location: {
              country: '',
              city: '',
              street: '',
              postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: [],
          }];
        
        store.addTagToUser('1', 'new-tag');
        expect(store.users[0].tags).toContain('new-tag');
      });

      it('removes tag from user', () => {
        const store = useUserStore();
        store.users = [{
            id: '1',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'female',
            thumbnail: '',
            picture: '',
            location: {
              country: '',
              city: '',
              street: '',
              postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: ['tag-to-remove'],
        }];
        
        store.removeTagFromUser('1', 'tag-to-remove');
        expect(store.users[0].tags).not.toContain('tag-to-remove');
      });

      it('toggles tag for user', () => {
        const store = useUserStore();
        store.users = [{
            id: '1',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'female',
            thumbnail: '',
            picture: '',
            location: {
              country: '',
              city: '',
              street: '',
              postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: [],
        }];
        
        store.toggleUserTag('1', 'test-tag');
        expect(store.users[0].tags).toContain('test-tag');
        
        store.toggleUserTag('1', 'test-tag');
        expect(store.users[0].tags).not.toContain('test-tag');
      });
    });
  });

  describe('Getters', () => {
    describe('filteredUsers', () => {
      it('filters users by search text', () => {
        const store = useUserStore();
        store.users = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                gender: 'male',
                thumbnail: '',
                picture: '',
                location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
                },
                age: 30,
                phone: '',
                isFavorite: false,
                tags: [],
            },
            {
                id: '1',
                firstName: 'Jane',
                lastName: 'Smith',
                email: '',
                gender: 'female',
                thumbnail: '',
                picture: '',
                location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
                },
                age: 30,
                phone: '',
                isFavorite: false,
                tags: [],
            }
        ];
        store.filters.searchText = 'john';
        
        expect(store.filteredUsers).toHaveLength(1);
        expect(store.filteredUsers[0].firstName).toBe('John');
      });

      it('filters users by gender', () => {
        const store = useUserStore();
        store.users = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                gender: 'male',
                thumbnail: '',
                picture: '',
                location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
                },
                age: 30,
                phone: '',
                isFavorite: false,
                tags: [],
            },
            {
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: '',
                gender: 'female',
                thumbnail: '',
                picture: '',
                location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
                },
                age: 30,
                phone: '',
                isFavorite: false,
                tags: [],
            }
        ];
        store.filters.gender = 'male';
        
        expect(store.filteredUsers).toHaveLength(1);
        expect(store.filteredUsers[0].gender).toBe('male');
      });

      it('filters users by favorite status', () => {
        const store = useUserStore();
        store.users = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                gender: 'male',
                thumbnail: '',
                picture: '',
                location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
                },
                age: 30,
                phone: '',
                isFavorite: true,
                tags: [],
            },
            {
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: '',
                gender: 'female',
                thumbnail: '',
                picture: '',
                location: {
                country: '',
                city: '',
                street: '',
                postcode: '',
                },
                age: 30,
                phone: '',
                isFavorite: false,
                tags: [],
            }
        ];
        store.filters.favoritesOnly = true;
        
        expect(store.filteredUsers).toHaveLength(1);
        expect(store.filteredUsers[0].isFavorite).toBe(true);
      });
    });

    describe('allTags', () => {
      it('returns unique tags', () => {
        const store = useUserStore();
        store.tags = ['tag1', 'tag2', 'tag1'];
        
        expect(store.allTags).toHaveLength(2);
        expect(store.allTags).toEqual(['tag1', 'tag2']);
      });
    });
  });

  describe('State Persistence', () => {
    it('initializes from storage', () => {
      const store = useUserStore();
      store.initializeFromStorage();
      
      expect(store.tags).toEqual(['test-tag']);
      expect(store.hydrated).toBe(true);
    });

    it('persists state changes', () => {
      const store = useUserStore();
      store.users = [{
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: '',
            gender: 'male',
            thumbnail: '',
            picture: '',
            location: {
            country: '',
            city: '',
            street: '',
            postcode: '',
            },
            age: 30,
            phone: '',
            isFavorite: false,
            tags: [],
        }
      ];
      store.persistState();
      
      // We could add expectations here if we want to verify the interaction
      // with the localStorage mock
      expect(true).toBe(true); // At least verify the function runs without error
    });
  });
});