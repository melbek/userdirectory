// tests/composables/useApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '@/composables/useApi';

describe('useApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('fetches users with default parameters', async () => {
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          results: [{
            id: { value: '123' },
            name: { first: 'john', last: 'doe' },
            email: 'john@example.com',
            gender: 'male',
            picture: {
              thumbnail: 'thumb.jpg',
              large: 'large.jpg'
            },
            location: {
              country: 'USA',
              city: 'New York',
              street: { number: 123, name: 'Main St' },
              postcode: 12345
            },
            dob: { age: 30 },
            phone: '123-456-7890'
          }]
        })
      });

      const { fetchUsers } = useApi();
      const users = await fetchUsers();

      // Verify fetch was called with correct URL
      expect(fetch).toHaveBeenCalledWith(
        'https://randomuser.me/api/?page=1&results=25&seed=nuxt-app&exc=login,registered,nat'
      );

      // Verify transformed user data
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual({
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'male',
        thumbnail: 'thumb.jpg',
        picture: 'large.jpg',
        location: {
          country: 'USA',
          city: 'New York',
          street: '123 Main St',
          postcode: '12345'
        },
        age: 30,
        phone: '123-456-7890',
        isFavorite: false,
        tags: []
      });
    });

    it('fetches users with custom page and limit', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ results: [] })
      });

      const { fetchUsers } = useApi();
      await fetchUsers(2, 10);

      expect(fetch).toHaveBeenCalledWith(
        'https://randomuser.me/api/?page=2&results=10&seed=nuxt-app&exc=login,registered,nat'
      );
    });

    it('handles API error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

      const { fetchUsers } = useApi();
      await expect(fetchUsers()).rejects.toThrow('API Error');
    });

    it('handles malformed API response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ results: [{}] })
      });

      const { fetchUsers } = useApi();
      await expect(fetchUsers()).rejects.toThrow();
    });
  });

  describe('transformUser', () => {
    it('handles null/undefined values', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          results: [{
            id: { value: null },
            name: { first: 'john', last: 'doe' },
            email: 'john@example.com',
            gender: 'male',
            picture: {
              thumbnail: null,
              large: undefined
            },
            location: {
              country: 'USA',
              city: 'New York',
              street: { number: '', name: 'Main St' },
              postcode: null
            },
            dob: { age: null },
            phone: null
          }]
        })
      });

      const { fetchUsers } = useApi();
      const users = await fetchUsers();

      expect(users[0]).toEqual(expect.objectContaining({
        id: null,
        email: 'john@example.com',
        gender: 'male',
        firstName: 'John',
        lastName: 'Doe',
        isFavorite: false,
        thumbnail: null,
        picture: undefined,
        location: {
          country: 'USA',
          city: 'New York',
          street: ' Main St',
          postcode: ''
        },
        tags: [],
        age: null,
        phone: null
      }));
    });

    it('capitalizes first and last names correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          results: [{
            id: { value: '123' },
            name: { first: 'john', last: 'DOE' },
            email: 'john@example.com',
            gender: 'male',
            picture: { thumbnail: '', large: '' },
            location: {
              country: '',
              city: '',
              street: { number: 0, name: '' },
              postcode: ''
            },
            dob: { age: 0 },
            phone: ''
          }]
        })
      });

      const { fetchUsers } = useApi();
      const users = await fetchUsers();

      expect(users[0].firstName).toBe('John');
      expect(users[0].lastName).toBe('Doe');
    });

    it('handles empty string values', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          results: [{
            id: { value: '' },
            name: { first: '', last: '' },
            email: '',
            gender: '',
            picture: { thumbnail: '', large: '' },
            location: {
              country: '',
              city: '',
              street: { number: 0, name: '' },
              postcode: ''
            },
            dob: { age: 0 },
            phone: ''
          }]
        })
      });

      const { fetchUsers } = useApi();
      const users = await fetchUsers();

      expect(users[0]).toEqual(expect.objectContaining({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        thumbnail: '',
        picture: '',
        location: {
          country: '',
          city: '',
          street: '0 ',
          postcode: ''
        },
        age: 0,
        phone: '',
        isFavorite: false,
        tags: []
      }));
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { fetchUsers } = useApi();
      await expect(fetchUsers()).rejects.toThrow('Network error');
    });

    it('handles invalid JSON response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      const { fetchUsers } = useApi();
      await expect(fetchUsers()).rejects.toThrow('Invalid JSON');
    });

    it('handles missing results in response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({})
      });

      const { fetchUsers } = useApi();
      await expect(fetchUsers()).rejects.toThrow();
    });
  });
});