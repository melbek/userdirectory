import type { User } from '@/types/user'

/**
 * API composable for interacting with the RandomUser.me API.
 * Provides type-safe user data fetching with automatic transformation
 * to match our application's User interface.
 *
 * @example
 * ```typescript
 * const { fetchUsers } = useApi();
 * 
 * // Fetch first page of users
 * const users = await fetchUsers();
 * 
 * // Fetch specific page with custom limit
 * const customUsers = await fetchUsers(2, 10);
 * ```
 */
export const useApi = () => {
  /** Base URL for the RandomUser.me API */
  const baseUrl = 'https://randomuser.me/api'

  /**
   * Capitalizes the first letter of a string and converts the rest to lowercase.
   * 
   * @param {string} str - The string to transform
   * @returns {string} The transformed string with first letter capitalized
   * @example capitalizeFirst('jOHN') // Returns 'John'
   */
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  /**
   * Transforms raw user data from the API into our application's User type.
   * Handles null values and missing properties gracefully.
   *
   * @param {any} userData - Raw user data from the API
   * @returns {User} Transformed user data matching our User interface
   */
  const transformUser = (userData: any): User => {
    return {
      id: userData.id.value ?? '',
      firstName: capitalizeFirst(userData.name.first),
      lastName: capitalizeFirst(userData.name.last),
      email: userData.email ?? '',
      gender: userData.gender ?? '',
      thumbnail: userData.picture.thumbnail ?? '',
      picture: userData.picture.large ?? '',
      location: {
        country: userData.location.country ?? '',
        city: userData.location.city ?? '',
        street: `${userData.location.street.number ?? ''} ${userData.location.street.name ?? ''}`,
        postcode: userData.location.postcode?.toString() ?? '',
      },
      age: userData.dob.age ?? 0,
      phone: userData.phone ?? '',
      isFavorite: false,
      tags: [],
    }
  }

  /**
   * Fetches users from the RandomUser.me API with pagination support.
   * Results are consistent across requests due to the fixed seed.
   *
   * @param {number} [page=1] - The page number to fetch
   * @param {number} [limit=25] - Number of users to fetch per page
   * @returns {Promise<User[]>} Array of transformed user objects
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * // Fetch first page with default limit
   * const users = await fetchUsers();
   *
   * // Fetch second page with 10 users
   * const nextUsers = await fetchUsers(2, 10);
   * ```
   */
  const fetchUsers = async (page: number = 1, limit: number = 25): Promise<User[]> => {
    try {
      const response = await fetch(`${baseUrl}/?page=${page}&results=${limit}&seed=nuxt-app&exc=login,registered,nat`)
      const data = await response.json()
      //console.log('Calling API');
      return data.results.map(transformUser)
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  return {
    fetchUsers,
  }
}