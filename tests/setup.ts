import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock Nuxt components
config.global.components = {
  'NuxtLink': true
};

// Mock window.fs for file operations
const mockFs = {
  readFile: vi.fn(),
  writeFile: vi.fn()
};

Object.defineProperty(window, 'fs', {
  value: mockFs
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});