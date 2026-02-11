# NetVerse 🌐

<div align="center">

![NetVerse Logo](https://img.shields.io/badge/NetVerse-Social_Media_Platform-blue?style=for-the-badge)

A modern, full-stack social media platform with real-time capabilities, built with the MERN stack and Socket.IO.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5.2.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.3-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-quick-start) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About NetVerse

NetVerse is a **production-ready social media platform** that brings together the best features from popular social networks. Built with modern web technologies, it offers a seamless experience for real-time communication, content sharing, and social networking.

Whether you're looking to build a social platform for a specific community or create the next big social network, NetVerse provides a solid foundation with enterprise-level features including:

- 🔐 Secure JWT authentication with password reset
- 💬 Real-time messaging with typing indicators
- 📸 24-hour auto-expiring stories
- 📝 Posts with likes, comments, reposts & privacy controls
- 🔔 Live push notifications
- 🔍 User discovery and content search
- 👥 Follow system with private account support
- 🌙 Dark/Light theme toggle
- ☁️ Cloud-based media storage via Cloudinary

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based secure auth with email password reset & welcome emails |
| **User Profiles** | Customizable profiles with avatar, cover photo, bio, location, website |
| **Public/Private Accounts** | Private accounts require follow approval via follow requests |
| **Posts** | Create posts with images, tags, location & privacy (public/friends/private) |
| **Reposts** | Share others' posts to your feed |
| **Stories** | 24-hour auto-expiring stories with image/video support and view tracking |
| **Real-time Chat** | 1:1 and group chats with typing indicators & read receipts |
| **Notifications** | Live notifications for follows, likes, comments, mentions, messages |
| **Social Graph** | Follow/unfollow with follow requests for private accounts |
| **Search & Discovery** | Full-text search for users and explore trending content |
| **Saved Posts** | Bookmark posts for later viewing |
| **Online Status** | Real-time user presence with last seen tracking |
| **Dark Mode** | System-aware theme toggle with persistence |

### Backend Features

- ✅ Clean MVC architecture with ES Modules
- ✅ RESTful API design with versioned endpoints
- ✅ Express.js 5 with async/await error handling
- ✅ MongoDB with Mongoose 9 ODM & virtuals
- ✅ JWT authentication with secure password hashing (bcrypt)
- ✅ Socket.IO for real-time bidirectional events
- ✅ Cloudinary integration for optimized media storage
- ✅ Email service via Nodemailer (password reset, welcome)
- ✅ Request validation with express-validator
- ✅ Centralized error handling middleware
- ✅ CORS configuration for cross-origin requests
- ✅ Graceful shutdown with cleanup handlers
- ✅ Text search indexes for fast user discovery

### Frontend Features

- ✅ React 19 with modern hooks patterns
- ✅ React Router 7 for client-side routing
- ✅ Zustand for lightweight state management
- ✅ TailwindCSS 4 with Vite plugin
- ✅ Socket.IO client for real-time updates
- ✅ Axios with interceptors for API requests
- ✅ Fully responsive mobile-first design
- ✅ Toast notifications via Sonner
- ✅ Modern icons with Lucide React
- ✅ Protected routes with auth guards
- ✅ Dark/Light theme with system preference

---

## 🛠 Tech Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 5.2.1 | Web framework |
| `mongoose` | 9.1.5 | MongoDB ODM |
| `socket.io` | 4.8.3 | Real-time WebSocket communication |
| `jsonwebtoken` | 9.0.3 | JWT authentication |
| `bcryptjs` | 3.0.3 | Password hashing |
| `cloudinary` | 2.9.0 | Cloud media storage |
| `multer` | 2.0.2 | Multipart form data handling |
| `nodemailer` | 7.0.12 | Email sending |
| `express-validator` | 7.3.1 | Request validation |
| `dotenv` | 17.2.3 | Environment variables |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2.0 | UI library |
| `react-router-dom` | 7.13.0 | Client-side routing |
| `zustand` | 5.0.11 | State management |
| `socket.io-client` | 4.8.3 | WebSocket client |
| `axios` | 1.13.4 | HTTP client |
| `tailwindcss` | 4.1.18 | Utility-first CSS |
| `sonner` | 2.0.7 | Toast notifications |
| `lucide-react` | 0.563.0 | Icon library |
| `date-fns` | 4.1.0 | Date utilities |
| `vite` | 7.2.4 | Build tool & dev server |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB** v6+ — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** — [Sign up free](https://cloudinary.com)
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Eman-Nadeem/NetVerse.git
cd NetVerse
```

2. **Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file in `backend/` with:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/netverse

# JWT (change in production!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Cloudinary (required for uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional — for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@netverse.com

# Server
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

3. **Frontend Setup**

```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/` with:

```env
VITE_API_URL=http://localhost:4000/api
```

4. **Start Development Servers**

```bash
# Terminal 1 — Backend
cd backend
npm start

# Terminal 2 — Frontend
cd frontend
npm start
```

🎉 **App is running:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

---

## 🔧 Configuration

### Cloudinary Setup (Required)

Cloudinary handles all media uploads (avatars, posts, stories):

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Navigate to **Settings → API & Security**
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Add credentials to backend `.env`

> 💡 The free tier includes 25GB storage and 25GB bandwidth/month

### Email Setup (Optional)

Email is used for password reset and welcome messages. See [EMAIL_SETUP.md](./backend/EMAIL_SETUP.md) for detailed instructions.

**Quick Gmail Setup:**
1. Enable 2FA on your Google Account
2. Create an App Password: *Google Account → Security → App passwords*
3. Use the 16-character password in `.env`

**Production Alternatives:** SendGrid, Mailgun, AWS SES

---

## 📁 Project Structure

```
NetVerse/
├── backend/
│   ├── server.js                 # Entry point & server initialization
│   ├── src/
│   │   ├── app.js               # Express app & middleware setup
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB connection
│   │   │   ├── socket.js        # Socket.IO events & handlers
│   │   │   └── cloudinary.js    # Cloudinary configuration
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── postController.js
│   │   │   ├── storyController.js
│   │   │   ├── chatController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── validator.js     # Input validation rules
│   │   │   ├── errorHandler.js  # Global error handler
│   │   │   └── upload.js        # Multer file handling
│   │   ├── models/
│   │   │   ├── User.js          # User schema with virtuals
│   │   │   ├── Post.js          # Posts with privacy & reposts
│   │   │   ├── Comment.js       # Nested comments
│   │   │   ├── Story.js         # 24h expiring stories
│   │   │   ├── Chat.js          # 1:1 and group chats
│   │   │   ├── Message.js       # Chat messages
│   │   │   └── Notification.js  # All notification types
│   │   ├── routes/              # API route definitions
│   │   └── utils/               # Helper functions
│   ├── EMAIL_SETUP.md
│   └── README.md                # API documentation
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # Routes & socket setup
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Sidebar, BottomBar
│   │   │   ├── posts/           # PostCard, CreatePost, Comments
│   │   │   ├── stories/         # StoryTray, StoryViewer, CreateStory
│   │   │   ├── chat/            # MessageBubble
│   │   │   ├── profile/         # EditProfileModal
│   │   │   ├── users/           # UserGrid, WhoToFollow
│   │   │   ├── ui/              # Avatar, Button, Skeleton
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Route page components
│   │   ├── store/               # Zustand stores
│   │   │   ├── authStore.js
│   │   │   ├── chatStore.js
│   │   │   ├── notificationStore.js
│   │   │   └── themeStore.js
│   │   └── lib/
│   │       ├── api.js           # Axios instance
│   │       └── socket.js        # Socket.IO client
│   └── public/
│
└── README.md                     # This file
```

---

## 📚 API Documentation

Full REST API documentation is available in [backend/README.md](./backend/README.md).

### API Endpoints Overview

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| **Auth** | `/api/auth/*` | Register, login, password reset |
| **Users** | `/api/users/*` | Profiles, follow, search, settings |
| **Posts** | `/api/posts/*` | CRUD, likes, comments, reposts, saved |
| **Stories** | `/api/stories/*` | Create, view, delete stories |
| **Chats** | `/api/chats/*` | Conversations, messages, groups |
| **Notifications** | `/api/notifications/*` | Fetch, mark read, clear |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Join user's room for notifications |
| `sendMessage` | Client → Server | Send chat message |
| `typing` | Client → Server | Broadcast typing indicator |
| `newNotification` | Server → Client | Push new notification |
| `newMessage` | Server → Client | Push new chat message |
| `userTyping` | Server → Client | User is typing |
| `userStatusChange` | Server → Client | Online/offline status change |

### Available Scripts

```bash
# Backend
npm start          # Start with nodemon (auto-reload)

# Frontend
npm start          # Vite dev server (HMR)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

---

## 🔒 Security Features

- **Password Security** — bcryptjs hashing with salt rounds
- **JWT Auth** — Secure token-based authentication with expiration
- **Input Validation** — express-validator on all endpoints
- **CORS** — Configured cross-origin resource sharing
- **Environment Variables** — Sensitive data in `.env` files
- **Error Sanitization** — No sensitive data in error responses
- **Graceful Shutdown** — Proper cleanup of connections
- **Password Select: false** — Passwords excluded from queries by default

---

## 🌟 Key Features in Detail

### Real-time Updates (Socket.IO)

- **Live Notifications** — Instant alerts for all interactions
- **Real-time Chat** — Messages delivered immediately
- **Online Status** — See who's online with last seen tracking
- **Typing Indicators** — Know when someone is typing
- **Unread Count Sync** — Badge counts update in real-time

### Stories System

- **Auto-expiration** — Stories automatically expire after 24 hours
- **View Tracking** — See who viewed your stories
- **Media Support** — Images and videos with captions
- **Progress Bar** — Auto-advance through stories
- **Keyboard Navigation** — Arrow keys to navigate

### Posts & Interactions

- **Rich Media** — Multiple images per post
- **Privacy Controls** — Public, friends-only, or private
- **Likes & Comments** — Full engagement system
- **Reposts** — Share others' posts to your feed
- **Tags & Location** — Add context to posts
- **Saved Posts** — Bookmark for later

### Private Accounts

- **Follow Requests** — Approve who can follow you
- **Content Protection** — Only followers see posts/stories
- **Request Management** — Accept/reject follow requests

---

## 🎨 Frontend Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Home feed | ✅ |
| `/profile/:id` | User profile | ✅ |
| `/profile/:id/:type` | Followers/following list | ✅ |
| `/chats` | Chat list | ✅ |
| `/chats/:chatId` | Chat room | ✅ |
| `/notifications` | All notifications | ✅ |
| `/search` | Search users | ✅ |
| `/explore` | Discover content | ✅ |
| `/login` | Sign in | ❌ |
| `/register` | Sign up | ❌ |
| `/forgot-password` | Request reset | ❌ |
| `/reset-password/:token` | Reset password | ❌ |

---

## 🚀 Deployment

### Backend

**Recommended:** [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io)

Set all environment variables from `.env` in your hosting dashboard.

### Frontend

**Recommended:** [Vercel](https://vercel.com), [Netlify](https://netlify.com), [Cloudflare Pages](https://pages.cloudflare.com)

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment:** Set `VITE_API_URL` to your deployed backend URL

### Database

**Recommended:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier: 512MB)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Guidelines:**
- Follow existing code style (ES Modules, async/await)
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running; verify `MONGO_URI` |
| Port already in use | Change `PORT` in `.env` or kill the process |
| Cloudinary upload fails | Verify Cloudinary credentials in `.env` |
| Email not sending | Check SMTP credentials; see [EMAIL_SETUP.md](./backend/EMAIL_SETUP.md) |
| CORS errors | Ensure `CLIENT_URL` matches frontend origin |
| Socket not connecting | Check `VITE_API_URL` points to correct backend |

**Need help?** Open an [issue on GitHub](https://github.com/Eman-Nadeem/NetVerse/issues)

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Eman Nadeem** — [@Eman-Nadeem](https://github.com/Eman-Nadeem)

---

## 🙏 Acknowledgments

- [React](https://react.dev) — UI library
- [Express.js](https://expressjs.com) — Backend framework
- [MongoDB](https://www.mongodb.com) — Database
- [Socket.IO](https://socket.io) — Real-time engine
- [Cloudinary](https://cloudinary.com) — Media management
- [TailwindCSS](https://tailwindcss.com) — Styling
- [Vite](https://vitejs.dev) — Build tool

---

<div align="center">

**Built with ❤️ using the MERN Stack**

⭐ **Star this repo if you find it helpful!** ⭐

[Report Bug](https://github.com/Eman-Nadeem/NetVerse/issues) · [Request Feature](https://github.com/Eman-Nadeem/NetVerse/issues)

</div>
