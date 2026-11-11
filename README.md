# Secure Notes API Backend

Express and TypeScript backend for the Secure Notes application.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017`

## Environment Configuration
Create a `.env` file in `backend/` with the following variables:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/secure_notes_db
JWT_SECRET=your_super_secret_jwt_key
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@local
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

`CORS_ORIGIN` is a comma-separated list of allowed origins. It is strictly enforced without implicit fallbacks.

> **Note on Port 5001**: Port 5000 is reserved by macOS AirPlay Receiver / ControlCenter. Hence, the backend defaults to port `5001`.

## Scripts
- `npm run dev`: Start the development server using `tsx watch`
- `npm run build`: Compile TypeScript to JavaScript in `dist/`
- `npm start`: Run the compiled production build from `dist/server.js`
- `npm run seed:admin`: Seed or update the administrator account in MongoDB

## Database Seeding
To initialize or update the admin account, run:
```bash
npm run seed:admin
```
This script reads `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env`, validates them, and ensures an account with role `"admin"` exists.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new account (`name`, `email`, `password`, optional `interests`)
- `POST /api/auth/login` - Authenticate user (`email`, `password`), returns JWT token and profile
- `GET /api/auth/profile` - Get authenticated user profile (`Authorization: Bearer <token>`)

### Notes (Protected)
- `GET /api/notes?page=1&limit=5` - Paginated notes (regular users see own notes, admins see all with author name and email)
- `GET /api/notes/:id` - Fetch single note by ID
- `POST /api/notes` - Create a note (`title`, `content`)
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Admin (Protected, Admin Only)
- `GET /api/admin/users` - Paginated user management
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Aggregation
- `GET /api/aggregations/interests` - Aggregated user counts grouped by interest
- `GET /api/aggregations/users/:userId/posts` - Aggregated user details and their authored posts

