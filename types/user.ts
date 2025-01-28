export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: 'male' | 'female';
    thumbnail: string;
    picture: string;
    location: {
      country: string;
      city: string;
      street: string;
      postcode: string;
    };
    age: number;
    phone: string;
    isFavorite: boolean;
    tags: string[];
  }
  
  export interface UserState {
    users: User[];
    selectedUser: User | null;
    filters: {
      searchText: string;
      gender: string | null;
      favoritesOnly: boolean;
    };
    tags: string[];
    page: number;
    loading: boolean;
  }