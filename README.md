# 🌍 LocalLoop

> A hyperlocal community board where neighbors connect, share events, request help, and discover what's happening around them.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📌 Problem Statement

There is no good platform for hyperlocal community interaction. WhatsApp groups are chaotic, Facebook is outdated, and general social media lacks location-based community features. **LocalLoop** solves this by giving neighborhoods a dedicated space to post events, offer help, make requests, and share announcements — all in one clean, organized feed.

---

## ✨ Features

- 🔐 **Authentication** — Email/Password + Google OAuth via Firebase Auth
- 📋 **Community Feed** — Browse posts filtered by category (Events, Requests, Offers, Announcements)
- 🔍 **Search** — Search posts by title, description, and location in real time
- ✍️ **Create & Edit Posts** — Full CRUD with Firestore (title, description, category, location, image URL)
- 💬 **Comments** — Real-time comments on every post via Firestore `onSnapshot`
- 🙋 **"I'm In"** — Express interest in community events (toggle per user)
- 📊 **Dashboard** — View your posts, joined events, and activity stats (posts + comments received)
- 👤 **User Profiles** — Public profile pages for every user with post count and join date
- 📱 **Fully Responsive** — Works on mobile and desktop with a floating action button on mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Functional Components + Hooks) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 |
| Backend | Firebase (Auth + Firestore) |
| Build Tool | Vite |
| Deployment | Vercel / Netlify |

---

## ⚛️ React Concepts Used

- `useState`, `useEffect`, `useRef` — core state and side effects
- `useContext` — global auth state via `AuthContext`
- `useLocation` — active route detection for conditional Navbar rendering
- `useMemo` — optimized post filtering and searching (title, description, location)
- `useCallback` — memoized event handlers throughout
- `React.lazy` + `Suspense` — all 10 page components are lazy-loaded
- Controlled Components — all form inputs (login, signup, create post, edit post, comments)
- Protected Routes — `ProtectedRoute` wrapper redirects unauthenticated users
- Lifting State Up — shared filter/search state in Feed
- Custom Hooks — `useAuth`, `usePosts`, `useComments`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky top nav with user dropdown menu
│   ├── PostCard.jsx        # Post preview card for the feed grid
│   ├── CommentBox.jsx      # Real-time comment form + list
│   ├── CategoryBadge.jsx   # Colour-coded category pill
│   ├── ProtectedRoute.jsx  # Auth guard wrapper component
│   ├── Loader.jsx          # Animated loading spinner
│   └── Avatar.jsx          # User avatar (photo or initials fallback)
├── pages/
│   ├── Landing.jsx         # Public hero + features + how-it-works
│   ├── Login.jsx           # Email/password + Google sign-in
│   ├── Signup.jsx          # Email/password + Google sign-up
│   ├── Feed.jsx            # Community feed with filter + search
│   ├── PostDetail.jsx      # Full post view with I'm In + comments
│   ├── CreatePost.jsx      # New post form with validation
│   ├── EditPost.jsx        # Edit existing post form
│   ├── Dashboard.jsx       # User stats, my posts tab, joined events tab
│   ├── Profile.jsx         # Public user profile with post grid
│   └── NotFound.jsx        # 404 fallback page
├── context/
│   └── AuthContext.jsx     # Auth provider + signup/login/logout actions
├── hooks/
│   ├── useAuth.js          # Thin wrapper around AuthContext
│   ├── usePosts.js         # Firestore posts subscription + filter/search
│   └── useComments.js      # Firestore comments subscription + submit
├── services/
│   ├── firebase.js         # Firebase app init, auth & db exports
│   ├── auth.js             # Email/password + Google auth functions
│   └── firestore.js        # All Firestore read/write/subscribe functions
└── assets/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/localloop.git

# 2. Navigate into the project
cd localloop

# 3. Install dependencies
npm install

# 4. Create a .env file in the root
touch .env
```

### Firebase Configuration

Create a `.env` file in the root of the project and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Firebase Setup

### Authentication
Enable the following providers in Firebase Console → Authentication → Sign-in method:
- ✅ Email/Password
- ✅ Google

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && (request.resource.data.authorId == request.auth.uid
          || request.resource.data.userId == request.auth.uid)
        && request.resource.data.title is string
        && request.resource.data.category is string;
      allow update, delete: if request.auth != null
        && (resource.data.authorId == request.auth.uid
          || resource.data.userId == request.auth.uid);
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null
          && request.resource.data.authorId == request.auth.uid;
        allow update, delete: if request.auth != null
          && resource.data.authorId == request.auth.uid;
      }
    }
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && (request.resource.data.authorId == request.auth.uid
          || request.resource.data.userId == request.auth.uid);
      allow update, delete: if request.auth != null
        && (resource.data.authorId == request.auth.uid
          || resource.data.userId == request.auth.uid);
    }
    match /reports/{reportId} {
      allow create: if request.auth != null
        && request.resource.data.reportedBy == request.auth.uid;
      allow read, update, delete: if false;
    }
  }
}
```

---

## 📄 Pages Overview

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing Page | ❌ |
| `/login` | Login | ❌ |
| `/signup` | Signup | ❌ |
| `/home` | Community Feed | ✅ |
| `/post/:id` | Post Detail | ✅ |
| `/create` | Create Post | ✅ |
| `/edit/:id` | Edit Post | ✅ |
| `/dashboard` | Dashboard | ✅ |
| `/profile/:uid` | User Profile | ✅ |
| `*` | 404 Not Found | ❌ |

---

## 🌐 Deployment

This app is deployed on **Vercel**.

To deploy your own version:

```bash
npm run build
```

Then drag the `dist/` folder into [Vercel](https://vercel.com) or connect your GitHub repo for auto-deployments.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your@email.com

---

## 📜 License

This project is licensed under the MIT License.

---

> Built with ❤️ as an end-term project for *Building Web Applications with React* — Batch 2029
#   W e b D e v - E n d t e r m - p r o j e c t - T e r m - 3 -  
 