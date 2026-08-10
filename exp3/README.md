# Experiment 3 - Role-Based Authentication & Route Protection

## Run in VS Code

Open the project folder in VS Code and run:

```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite.

## Demo accounts

- Admin: `admin` / `admin123`
- Editor: `editor` / `editor123`
- Viewer: `viewer` / `viewer123`

## Features

- Login authentication
- JWT-like token storage in localStorage
- Protected dashboard
- Role-based access control
- Admin-only panel
- Editor permissions
- Viewer permissions
- Unauthorized (403) page
- Logout

Note: This is a frontend-only practical demonstration. The token is a demo token; production authentication requires a backend that issues and validates real JWTs.
