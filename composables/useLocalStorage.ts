/**
 * A composable that provides type-safe localStorage functionality with error handling
 * and SSR compatibility. Handles serialization/deserialization of state automatically.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { saveState, loadState } = useLocalStorage();
 * 
 * // Save state
 * saveState('userPreferences', { theme: 'dark', fontSize: 14 });
 * 
 * // Load state
 * const preferences = loadState('userPreferences');
 * ```
 */
export const useLocalStorage = () => {
  /**
   * Saves state to localStorage with JSON serialization.
   * Handles SSR and errors gracefully.
   *
   * @param {string} key - The key under which to store the state
   * @param {any} state - The state to be stored. Must be JSON-serializable
   * @throws {Error} Logs error but doesn't throw if serialization or storage fails
   * @returns {void}
   *
   * @example
   * ```typescript
   * saveState('cart', { items: [], total: 0 });
   * ```
   */
  const saveState = (key: string, state: any) => {
    try {
      // Skip if we're not in a browser environment
      if (typeof window === 'undefined') return;
      const serializedState = JSON.stringify(state)
      localStorage.setItem(key, serializedState)
    } catch (error) {
      // Log but don't throw to prevent app crashes
      console.error('Error saving state to localStorage:', error)
    }
  }

  /**
   * Loads and deserializes state from localStorage.
   * Returns null if the state doesn't exist or if an error occurs.
   *
   * @param {string} key - The key from which to load the state
   * @returns {T | null} The deserialized state or null if not found/error occurs
   * @template T The expected type of the stored state
   *
   * @example
   * ```typescript
   * interface UserPreferences {
   *   theme: 'light' | 'dark';
   *   fontSize: number;
   * }
   * 
   * const preferences = loadState<UserPreferences>('userPreferences');
   * if (preferences) {
   *   console.log(preferences.theme); // Type-safe access
   * }
   * ```
   */
  const loadState = (key: string) => {
    try {
      // Skip if we're not in a browser environment
      if (typeof window === 'undefined') return;
      const serializedState = localStorage.getItem(key)
      return serializedState ? JSON.parse(serializedState) : null
    } catch (error) {
      // Log error and return null to allow graceful fallback
      console.error('Error loading state from localStorage:', error)
      return null
    }
  }

  return {
    saveState,
    loadState,
  }
}