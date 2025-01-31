// tests/plugins/persistedState.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { watch } from 'vue';
import { createPersistedStatePlugin } from '~/plugins/persistedState';
import type { User } from '~/types/user';

// Mock dependencies
vi.mock('vue', () => ({
    watch: vi.fn((getter, callback, options) => {
        // Store the callback so we can call it in our tests
        (vi.mocked(watch) as any).mockCallback = callback;
    })
}));

describe('Persisted State Plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  function createMockStore() {
    return {
      // Pinia required properties
      $id: 'users',
      $state: {},
      $patch: vi.fn(),
      $reset: vi.fn(),
      $subscribe: vi.fn(),
      $dispose: vi.fn(),
      $onAction: vi.fn(),
      
      // Our store properties and methods
      initializeFromStorage: vi.fn().mockResolvedValue(undefined),
      persistState: vi.fn(),
      filters: {},
      selectedUser: null as User | null,
      tags: [] as string[],
      page: 1,
      users: [] as User[],
      loading: false,
      error: null,
      hydrated: true
    };
  }

  it('uses custom debounce time', async () => {
    const mockStore = createMockStore();

    const plugin = createPersistedStatePlugin({
      debounceTime: 500,
      useStore: () => mockStore
    });

    await plugin();

    const watchCallback = (vi.mocked(watch).mock.calls[0][1] as Function);
    watchCallback();

    expect(mockStore.persistState).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 600));

    expect(mockStore.persistState).toHaveBeenCalled();
  });

  it('handles initialization errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockStore = createMockStore();
    mockStore.initializeFromStorage.mockRejectedValue(new Error('Init failed'));

    const plugin = createPersistedStatePlugin({
      useStore: () => mockStore
    });

    await expect(plugin()).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to initialize store:',
      expect.any(Error)
    );
  });

  it('debounces multiple rapid changes', async () => {
    const mockStore = createMockStore();

    const plugin = createPersistedStatePlugin({
      debounceTime: 100,
      useStore: () => mockStore
    });

    await plugin();

    const watchCallback = (vi.mocked(watch).mock.calls[0][1] as Function);
    
    watchCallback();
    watchCallback();
    watchCallback();

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(mockStore.persistState).toHaveBeenCalledTimes(1);
  });

  it('watches correct store properties', async () => {
    const mockStore = createMockStore();
    mockStore.filters = { searchText: '', gender: null, favoritesOnly: false };

    const plugin = createPersistedStatePlugin({
      useStore: () => mockStore
    });

    await plugin();

    const watchGetter = (vi.mocked(watch).mock.calls[0][0] as Function);
    const watchedState = watchGetter();

    expect(watchedState).toEqual({
      filters: { searchText: '', gender: null, favoritesOnly: false },
      selectedUser: null,
      tags: [],
      page: 1,
      users: []
    });
  });

  it('sets up beforeunload handler in browser environment', async () => {
    const mockStore = createMockStore();
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    const plugin = createPersistedStatePlugin({
      useStore: () => mockStore
    });

    await plugin();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );

    const [[, handler]] = addEventListenerSpy.mock.calls;
    (handler as Function)();

    expect(mockStore.persistState).toHaveBeenCalled();
  });
});