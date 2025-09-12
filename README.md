# Faded Elegance Backend (Node/Express + MongoDB)

This backend provides:
- Admin login (JWT)
- Gallery public API (list + single)
- Admin CRUD for gallery
- Admin dashboard stats
- Seed script with predefined admin and sample items

## Setup

1) Create a `.env` file in `server/` with:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/faded_elegance
JWT_SECRET=replace-with-a-strong-secret
SEED_ADMIN_EMAIL=admin@faded.local
SEED_ADMIN_PASSWORD=Admin#12345
```

2) Install dependencies
```
cd server
npm install
```

3) Seed predefined admin and gallery items
```
npm run seed
```

4) Start the server
```
npm run dev
```

## API

- POST `/api/auth/login` → body: `{ email, password }` → `{ token }`
- GET  `/api/gallery?page=&limit=` → public list
- GET  `/api/gallery/:id` → public single
- POST `/api/gallery` → admin only (Bearer token)
- PATCH `/api/gallery/:id` → admin only
- DELETE `/api/gallery/:id` → admin only
- GET  `/api/admin/stats` → admin only

Notes:
- Store images on CDN and save absolute URLs in `beforeImageUrl` and `afterImageUrl`.
- Public endpoints return only `isPublished=true` items.
