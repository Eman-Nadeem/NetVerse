# NetVerse Backend API

A complete, production-ready social media backend built with Express.js, Node.js, and MongoDB following clean MVC architecture.

## 🎯 Project Overview

NetVerse is a full-featured social media platform backend with real-time capabilities, cloud storage integration, and comprehensive user management. It provides a solid foundation for building social applications similar to Instagram, Twitter, or Facebook.

## ✨ Features

- ✅ **JWT Authentication** - Secure token-based authentication with refresh token support
- ✅ **User Management** - Complete profile management with follow/unfollow system
- ✅ **Posts System** - Create, like, comment, share, and delete posts
- ✅ **Stories** - 24-hour auto-expiring stories with media support
- ✅ **Real-time Chat** - Instant messaging via Socket.IO
- ✅ **Real-time Notifications** - Live updates for all interactions
- ✅ **Cloudinary Integration** - Image/video upload with automatic optimization
- ✅ **Email Notifications** - Password reset and welcome emails
- ✅ **Clean MVC Architecture** - Maintainable and scalable codebase
- ✅ **Comprehensive Validation** - Input validation using express-validator
- ✅ **Robust Error Handling** - Centralized error management
- ✅ **Search Functionality** - User and content search
- ✅ **Save Posts** - Bookmark posts for later viewing
- ✅ **Online Status Tracking** - Real-time user presence

## 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database and ODM |
| **JWT** | Authentication |
| **Socket.IO** | Real-time communication |
| **Cloudinary** | Cloud storage for media |
| **Nodemailer** | Email sending |
| **Multer** | File upload handling |
| **bcryptjs** | Password hashing |
| **express-validator** | Input validation |

## 📁 Project Structure

netverse-backend/
├── config/
│   ├── database.js       # MongoDB connection handler
│   ├── socket.js        # Socket.IO configuration & events
│   └── cloudinary.js    # Cloudinary configuration
├── controllers/
│   ├── auth.js           # Authentication logic
│   ├── user.js           # User operations
│   ├── post.js           # Post operations
│   ├── story.js          # Story operations
│   ├── chat.js           # Chat operations
│   └── notification.js   # Notification operations
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   ├── validator.js      # Request validation
│   ├── errorHandler.js    # Global error handling
│   └── upload.js         # File upload handling
├── models/
│   ├── User.js           # User schema
│   ├── Post.js           # Post schema
│   ├── Comment.js        # Comment schema
│   ├── Story.js          # Story schema
│   ├── Chat.js           # Chat schema
│   ├── Message.js        # Message schema
│   └── Notification.js   # Notification schema
├── routes/
│   ├── auth.js           # Auth routes
│   ├── user.js           # User routes
│   ├── post.js           # Post routes
│   ├── story.js          # Story routes
│   ├── chat.js           # Chat routes
│   └── notification.js   # Notification routes
├── utils/
│   ├── jwt.js            # JWT utilities
│   ├── cloudinary.js     # Cloudinary helper functions
│   └── email.js         # Email utilities
├── server.js            # Main server entry point
├── app.js              # Express app configuration
├── package.json         # Dependencies
├── .env.example         # Environment variables template
├── EMAIL_SETUP.md      # Email configuration guide
└── README.md           # This file

## 🏗 Architecture

### Simple & Clean

**Main Entry Point:** `server.js`

All server initialization in one file:
- Express app creation
- Middleware setup (CORS, body parser)
- Route registration
- Socket.IO initialization
- MongoDB connection
- Server startup
- Graceful shutdown

### Separation of Concerns

- **`config/database.js`** - MongoDB connection management
- **`config/socket.js`** - Socket.IO events and configuration
- **`app.js`** - Express app with routes and middleware
- **`server.js`** - Server bootstrap and lifecycle
- **`controllers/`** - Business logic
- **`routes/`** - Route definitions
- **`models/`** - Database schemas
- **`middleware/`** - Request processing
- **`utils/`** - Helper functions

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/netverse

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Optional but recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=noreply@netverse.com

# Cloudinary Configuration (Required for image/video uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=4000
NODE_ENV=development

# Client URL (for CORS and reset links)
CLIENT_URL=http://localhost:3000
```

### 3. Setting Up Cloudinary

1. **Create a Cloudinary account** at [cloudinary.com](https://cloudinary.com)
2. **Get your credentials:** Dashboard → Settings → API & Security
3. **Add credentials to `.env`:** Copy `Cloud Name`, `API Key`, and `API Secret`

**Note:** Cloudinary provides a generous free tier for development.

### 4. Setting Up Email (Optional but Recommended)

Email is used for password reset and welcome emails. You can use any SMTP provider.

#### Option 1: Gmail (Free)

1. Enable 2-Factor Authentication on your Google Account
2. Create an App Password:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Scroll down to "App passwords" → Create
   - Name it "NetVerse" and copy the 16-character password
3. Configure `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@netverse.com
```

#### Option 2: SendGrid (Recommended for Production)

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Create an API Key: Settings → API Keys → Create API Key
3. Use SMTP credentials:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your_sendgrid_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

#### Other Providers

You can use any SMTP-compatible provider:
- Mailgun
- AWS SES
- Postmark
- Mailjet

Just update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASSWORD` accordingly.

**Note:** Email functionality is optional. If not configured, password reset tokens will still work in development mode (returned in API response).

### 5. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run start
```

The server will start on port 4000.

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register

```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": null,
      "bio": null
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": null,
      "bio": null,
      "isOnline": true
    },
    "token": "jwt_token_here"
  }
}
```

### Logout

```
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get Current User

```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

### Forgot Password

```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

**Note:** In development mode, `resetToken` is included in the response for testing.

### Reset Password

```
POST /api/auth/reset-password/:resetToken
```

**Body:**
```json
{
  "password": "newpassword123"
}
```

---

## 👤 User Endpoints

### Get User Profile

```
GET /api/users/profile/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software Developer",
    "avatar": "https://res.cloudinary.com/...",
    "followersCount": 100,
    "followingCount": 50,
    "isFollowing": false
  }
}
```

### Update Profile

```
PUT /api/users/profile
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "bio": "Software Developer",
  "website": "https://example.com",
  "location": "New York"
}
```

### Follow/Unfollow User

```
POST /api/users/follow/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Followed successfully",
  "data": {
    "isFollowing": true
  }
}
```

### Search Users

```
GET /api/users/search?q=search_term&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Get User's Followers

```
GET /api/users/:id/followers?page=1
```

### Get User's Following

```
GET /api/users/:id/following?page=1
```

### Get User's Posts

```
GET /api/users/:id/posts?page=1&limit=10
```

### Save/Unsave Post

```
POST /api/users/saved-posts/:postId
```

**Headers:** `Authorization: Bearer <token>`

### Get Saved Posts

```
GET /api/users/saved-posts?page=1&limit=10
```

**Headers:** `Authorization: Bearer <token>`

---

## 📝 Post Endpoints

### Create Post

```
POST /api/posts
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "content": "This is my first post!",
  "tags": ["social", "network"],
  "location": "New York",
  "privacy": "public"
}
```

**For file uploads:** Use `multipart/form-data` with images.

### Get Feed

```
GET /api/posts?page=1&limit=10
```

**Headers:** `Authorization: Bearer <token>`

Returns posts from current user and users they follow.

### Get Single Post

```
GET /api/posts/:id
```

### Delete Post

```
DELETE /api/posts/:id
```

**Headers:** `Authorization: Bearer <token>`

### Like/Unlike Post

```
POST /api/posts/:id/like
```

**Headers:** `Authorization: Bearer <token>`

### Add Comment

```
POST /api/posts/:id/comment
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "content": "Great post!",
  "parent": null
}
```

**Note:** Include `parent` ID for replies.

### Get Post Comments

```
GET /api/posts/:id/comments?page=1&limit=20
```

### Share Post

```
POST /api/posts/:id/share
```

**Headers:** `Authorization: Bearer <token>`

---

## 📸 Story Endpoints

### Create Story

```
POST /api/stories
```

**Headers:** `Authorization: Bearer <token>`

**Body (for file upload):** Use `multipart/form-data` with media file.

**Body (for pre-uploaded media):**
```json
{
  "media": {
    "type": "image",
    "url": "https://cloudinary.com/...",
    "publicId": "cloudinary_id"
  },
  "caption": "My story"
}
```

### Get Stories

```
GET /api/stories
```

**Headers:** `Authorization: Bearer <token>`

Returns stories from users you follow and your own stories.

### Get Single Story

```
GET /api/stories/:id
```

**Headers:** `Authorization: Bearer <token>`

Automatically marks the story as viewed.

### Delete Story

```
DELETE /api/stories/:id
```

**Headers:** `Authorization: Bearer <token>`

### Get User's Stories

```
GET /api/stories/user/:userId
```

**Headers:** `Authorization: Bearer <token>`

---

## 💬 Chat Endpoints

### Create Chat

```
POST /api/chats
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "userId": "user_id_to_chat_with"
}
```

### Get All Chats

```
GET /api/chats
```

**Headers:** `Authorization: Bearer <token>`

### Get Chat by ID

```
GET /api/chats/:id
```

**Headers:** `Authorization: Bearer <token>`

### Send Message

```
POST /api/chats/:id/messages
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "content": "Hello!",
  "messageType": "text",
  "replyTo": null
}
```

### Get Chat Messages

```
GET /api/chats/:id/messages?page=1&limit=50
```

**Headers:** `Authorization: Bearer <token>`

Automatically marks messages as read.

### Delete Message

```
DELETE /api/chats/:chatId/messages/:messageId
```

**Headers:** `Authorization: Bearer <token>`

### Mark Chat as Read

```
PUT /api/chats/:id/read
```

**Headers:** `Authorization: Bearer <token>`

---

## 🔔 Notification Endpoints

### Get Notifications

```
GET /api/notifications?page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "unreadCount": 5,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### Get Unread Notifications

```
GET /api/notifications/unread
```

**Headers:** `Authorization: Bearer <token>`

### Mark Notification as Read

```
PUT /api/notifications/:id/read
```

**Headers:** `Authorization: Bearer <token>`

### Mark All Notifications as Read

```
PUT /api/notifications/read-all
```

**Headers:** `Authorization: Bearer <token>`

### Delete Notification

```
DELETE /api/notifications/:id
```

**Headers:** `Authorization: Bearer <token>`

### Clear All Notifications

```
DELETE /api/notifications
```

**Headers:** `Authorization: Bearer <token>`

---

## ⚡ Socket.IO Events

### Client → Server

#### Join Room
```javascript
socket.emit('join', userId);
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  chatId: 'chat_id',
  message: messageData,
  senderId: 'sender_id'
});
```

#### Typing Indicator
```javascript
socket.emit('typing', {
  chatId: 'chat_id',
  userId: 'user_id'
});
```

#### User Online Status
```javascript
socket.emit('userOnline', userId);
```

### Server → Client

#### Receive Message
```javascript
socket.on('receiveMessage', (message) => {
  // Handle incoming message
});
```

#### User Typing
```javascript
socket.on('userTyping', (data) => {
  // Show typing indicator
});
```

#### User Status Change
```javascript
socket.on('userStatusChange', (data) => {
  // Update online/offline status
});
```

#### New Notification
```javascript
socket.on('newNotification', (notification) => {
  // Show notification alert
});
```

#### Message Deleted
```javascript
socket.on('messageDeleted', (data) => {
  // Remove message from UI
});
```

---

## 📊 Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "msg": "Validation error",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📁 Project Structure (Updated)

## 📄 Pagination
backend/
Most list endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default varies by endpoint)

**Pagination Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🎨 Features Implemented

### Authentication
- ✅ User Registration
- ✅ User Login with JWT
- ✅ Forgot Password (with email)
- ✅ Reset Password
- ✅ Get Current User
- ✅ Logout

### User Management
- ✅ Get User Profile
- ✅ Update Profile
- ✅ Upload Avatar
- ✅ Follow/Unfollow Users
- ✅ Search Users
- ✅ Get Followers
- ✅ Get Following
- ✅ Save/Unsave Posts
### 1. Install Dependencies (Updated)

### Posts
npm install
# or
yarn install
- ✅ Get Feed (Personalized)
- ✅ Like/Unlike Posts
### 5. Start the Server (Updated)
- ✅ Reply to Comments
- ✅ Delete Posts
 # Development mode with hot reload
npm run dev
# or
yarn dev
- ✅ Tags Support
 # Production mode
npm start
# or
yarn start

### Stories
```bash
# Install dependencies (Updated)
npm install
# or
yarn install
- ✅ Delete Stories
 # Start development server
npm run dev
# or
yarn dev

 # Start production server
npm start
# or
yarn start
- ✅ Send Messages
 # Run linter (if configured)
npm run lint
# or
yarn lint
- ✅ Mark as Read
- ✅ Typing Indicators
- ✅ Real-time Messages
- ✅ Unread Count
- ✅ Reply to Messages

### Notifications
- ✅ Follow Notifications
- ✅ Like Notifications
- ✅ Comment Notifications
- ✅ Reply Notifications
- ✅ Message Notifications
- ✅ Story Notifications
- ✅ Real-time Notifications
- ✅ Mark as Read (single/all)
- ✅ Delete (single/all)
- ✅ Unread Count

### Real-time Features
- ✅ Socket.IO Integration
- ✅ Real-time Messages
- ✅ Real-time Notifications
- ✅ Online/Offline Status
- ✅ Typing Indicators

### Security Features
- ✅ Password Hashing with bcrypt
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Input Validation
- ✅ Error Handling
- ✅ CORS Configuration
- ✅ Cloudinary Secure Uploads
- ✅ Token Expiration
- ✅ Reset Token Expiration

### Email Features
- ✅ Welcome Emails
- ✅ Password Reset Emails
- ✅ Beautiful HTML Templates
- ✅ Multiple SMTP Providers
- ✅ Graceful Degradation (works without email config)

---

## ☁️ Cloudinary Integration

### Features

- Automatic image optimization
- Responsive image delivery
- CDN for fast loading
- Secure upload handling
- Automatic cleanup on resource deletion

### Upload Limits

| Type | Max Size | Count |
|------|----------|-------|
| Post Images | 10MB each | Max 10 images |
| Avatar Images | 5MB | 1 |
| Story Media | 50MB | 1 |
| Videos | 100MB | 1 |

### Folder Structure

- `netverse/posts/` - Post images
- `netverse/stories/` - Story media
- `netverse/avatars/` - User profile pictures

### Image Transformations

- **Avatars**: Automatically cropped to 400x400px squares
- **Post Images**: Limited to 1200px width, auto-optimized
- **Stories**: Limited to 1080px width for images

---

## 🔮 Future Enhancements

- [ ] Redis for Caching
- [ ] Rate Limiting
- [ ] Advanced Search (Elasticsearch)
- [ ] Analytics & Reporting
- [ ] Push Notifications (FCM)
- [ ] Video Calling (WebRTC)
- [ ] Multiple Language Support
- [ ] Content Moderation (AI-based)
- [ ] Groups in Chat
- [ ] Voice Messages
- [ ] Post Scheduling
- [ ] Analytics Dashboard

---

## 📖 Additional Documentation

- **`EMAIL_SETUP.md`** - Detailed email configuration guide
- **`.env.example`** - Environment variables template with comments
- **`worklog.md`** - Development history and changes

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

## 👥 Author

**Eman Nadeem**

A production-ready social media backend built with modern technologies and best practices.

---

## ⚡ Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run linter (if configured)
npm run lint
```

---

**Built with ❤️ for the developer community**
