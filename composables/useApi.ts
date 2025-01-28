import type { User } from '@/types/user'

export const useApi = () => {
  const baseUrl = 'https://randomuser.me/api'

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const transformUser = (userData: any): User => {
    return {
      id: userData.id.value,
      firstName: capitalizeFirst(userData.name.first),
      lastName: capitalizeFirst(userData.name.last),
      email: userData.email,
      gender: userData.gender,
      thumbnail: userData.picture.thumbnail,
      picture: userData.picture.large,
      location: {
        country: userData.location.country,
        city: userData.location.city,
        street: `${userData.location.street.number} ${userData.location.street.name}`,
        postcode: userData.location.postcode.toString(),
      },
      age: userData.dob.age,
      phone: userData.phone,
      isFavorite: false,
      tags: [],
    }
  }

  const fetchUsers = async (page: number = 1, limit: number = 25): Promise<User[]> => {
    try {
      const response = await fetch(`${baseUrl}/?page=${page}&results=${limit}&seed=nuxt-app&exc=login,registered,nat`)
      const data = await response.json()
      console.log('Calling API');
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