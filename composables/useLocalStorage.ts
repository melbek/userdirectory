export const useLocalStorage = () => {
  const saveState = (key: string, state: any) => {
    try {
      if (typeof window === 'undefined') return;
      const serializedState = JSON.stringify(state)
      localStorage.setItem(key, serializedState)
    } catch (error) {
      console.error('Error saving state to localStorage:', error)
    }
  }

  const loadState = (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      const serializedState = localStorage.getItem(key)
      return serializedState ? JSON.parse(serializedState) : null
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
      return null
    }
  }

  return {
    saveState,
    loadState,
  }
}