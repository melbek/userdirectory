# User Directory Application

A responsive web application built with Nuxt 3 that allows users to browse, search, and manage user profiles. The application integrates with the RandomUser.me API to fetch user data and provides features for organizing and filtering users.

## Key Features

- Browse user profiles with infinite scrolling
- Search users by name
- Filter users by gender and favorites
- Customizable tagging system for user organization
- Persistent state across page refreshes
- Responsive design for mobile and desktop
- Statistical overview of user data

## Technical Stack

- **Framework**: Nuxt 3
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **API Integration**: RandomUser.me API
- **TypeScript**: Full type safety throughout the application
- **Local Storage**: State persistence

## Core Functionality

- **User List**: Browse users with infinite scroll pagination
- **Search & Filters**: Find users by name, gender, or favorite status
- **Tag Management**: Create, edit, and delete tags for user organization
- **User Details**: View detailed user information including location and contact details
- **Statistics**: Visualize user demographics and tag distribution
- **State Persistence**: Maintain user preferences and state across sessions

The application demonstrates modern web development practices including state management, component composition, and responsive design while providing a practical tool for user data management.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
