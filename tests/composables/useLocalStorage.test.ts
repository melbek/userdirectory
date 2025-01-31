import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { useLocalStorage } from '@/composables/useLocalStorage'

describe('useLocalStorage composable', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should save and load state correctly', () => {
    const { saveState, loadState } = useLocalStorage()
    const key = 'testKey'
    const data = { name: 'Vue', version: 3 }

    saveState(key, data)
    const loadedData = loadState(key)

    expect(loadedData).toEqual(data)
  })

  it('should return null for non-existing key', () => {
    const { loadState } = useLocalStorage()
    expect(loadState('nonExistentKey')).toBeNull()
  })

  it('should handle JSON parsing errors gracefully', () => {
    const { loadState } = useLocalStorage()
    const key = 'corruptKey'
    localStorage.setItem(key, '{invalidJson}')

    expect(loadState(key)).toBeNull()
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error loading state from localStorage'),
        expect.any(Error)
    )
  })
})
