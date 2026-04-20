# 🚀 DevConnect — Developer Social Platform

A full-stack social platform built for software developers. Share knowledge in Markdown, connect with peers, get real-time notifications, and grow your professional network.

## ✨ Features

- **JWT Authentication** — Secure register, login, logout
- **Rich User Profiles** — Bio, skills, avatar, GitHub, website, location
- **Markdown Posts** — Full GFM support with code syntax highlighting
- **Like & Comment System** — Real-time interactions
- **Follow / Unfollow** — Build your developer network
- **Real-time Notifications** — Socket.io powered live alerts
- **Dark Mode** — System-aware with manual toggle
- **Responsive** — Mobile-first, works on all screen sizes
- **Toast Notifications** — Beautiful feedback on every action
- **Explore & Search** — Browse posts by tags

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Icons | React Icons |
| State | Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| Realtime | Socket.io |
| HTTP Client | Axios |

## 📁 Project Structure

```
devconnect/
├── server/                 # Node.js backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── notifications.js
│   ├── socket/
│   │   └── socket.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
└── client/                 # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/     # Avatar, Modal, Spinner, EmptyState
    │   │   ├── layout/     # AppLayout, Sidebar, RightPanel, MobileNav
    │   │   ├── posts/      # PostCard, PostList, CreatePost, CommentSection, EditPostModal
    │   │   ├── profile/    # EditProfileModal
    │   │   └── notifications/ # NotificationItem
    │   ├── context/        # Zustand stores
    │   ├── pages/          # All page components
    │   ├── utils/          # api.js (axios), socket.js
    │   ├── styles/         # Global CSS
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd devconnect
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env from example
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
npm install

# Create .env from example
cp .env.example .env

npm run dev
# Client starts on http://localhost:5173
```

### 4. Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET  | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users/:username` | Get user profile |
| PUT    | `/api/users/profile` | Update own profile |
| POST   | `/api/users/:id/follow` | Follow/unfollow user |
| GET    | `/api/users/suggestions` | Get follow suggestions |
| GET    | `/api/users/search?q=` | Search users |
| GET    | `/api/users/:username/posts` | Get user's posts |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/posts/feed` | Get feed posts |
| GET    | `/api/posts` | Get all posts (explore) |
| POST   | `/api/posts` | Create post |
| GET    | `/api/posts/:id` | Get single post |
| PUT    | `/api/posts/:id` | Edit post |
| DELETE | `/api/posts/:id` | Delete post |
| POST   | `/api/posts/:id/like` | Like/unlike post |
| POST   | `/api/posts/:id/comments` | Add comment |
| DELETE | `/api/posts/:id/comments/:cid` | Delete comment |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/notifications` | Get notifications |
| PUT    | `/api/notifications/read` | Mark as read |
| GET    | `/api/notifications/unread-count` | Get unread count |
| DELETE | `/api/notifications/:id` | Delete notification |

## 🔌 Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join` | Client → Server | `userId` |
| `notification` | Server → Client | Notification object |
| `new_post` | Server → Client | Post object |
| `typing` | Client → Server | `{ postId, username }` |
| `stop_typing` | Client → Server | `{ postId }` |

## 🚀 Deployment

### Backend (Render / Railway)
1. Set environment variables in dashboard
2. Set `NODE_ENV=production`
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` and `VITE_SOCKET_URL` to your backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

## 📝 License

MIT — free to use, modify, and distribute.
