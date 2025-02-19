# FormsCraft

A simple, elegant form builder with validations. Uses `localStorage` to store data with simulated network delays to fetch data.

### Development

- Install dependencies

```sh
pnpm install
```

- Run development server

```sh
pnpm dev
```

### Tech Used

- [React](https://react.dev/) for UI
- [Vite](https://vite.dev/) as the build tool
- [React Router](https://reactrouter.com/) for routing
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Radix](https://www.radix-ui.com/) for complex accessible components
- [Tanstack Query](https://tanstack.com/query/latest) for data fetching
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Vercel](https://vercel.com/) for deployment

### Structure

- `src/assets` for images/illustrations
- `src/components` for page specific components (not meant for reuse, but for separation of concerns)
- `src/pages` for components to be mounted on router
- `src/ui` for reusbale components
- `src/utils` for utility functions
