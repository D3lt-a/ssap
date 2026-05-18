A lightweight, zero-dependency utility package for simple personal full-stack projects. It provides a clean API to manage Express server-side sessions and React frontend protected routes without complex configurations.

## Installation

Ensure you have your peer dependencies installed in your projects:

```bash
npm install ssap
```

---

## 🛠️ Backend Usage (Express)

Import server-side helpers from `ssap/backend`.

```javascript
import express from 'express';
import { initSession, requireAuth } from 'ssap/backend';

const app = express();
app.use(express.json());

// 1. Initialize session middleware with a secret key
app.use(initSession('your-secure-dev-secret-key', false)); // Set second param to true in production (HTTPS)

// 2. Login Route (Set session details on successful authentication)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials here...
  if (username === 'admin' && password === 'password') {
    req.session.userId = 1;
    req.session.username = username;
    return res.json({ authenticated: true, message: 'Logged in!' });
  }
  
  return res.status(401).json({ authenticated: false, error: 'Invalid credentials' });
});

// 3. Auth Check Route (Used by React to verify active sessions)
app.get('/api/auth-check', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  return res.status(401).json({ authenticated: false });
});

// 4. Logout Route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid');
    return res.json({ authenticated: false });
  });
});

// 5. Protect sensitive endpoints using the middleware
app.get('/api/dashboard-data', requireAuth, (req, res) => {
  res.json({ message: 'Welcome to your private dashboard data!' });
});

```

---

## 💻 Frontend Usage (React + React Router)

Import frontend context and route wrappers from `ssap/frontend`.

### 1. Setup Your App Routing (`App.jsx`)

Wrap your routing setup inside `AuthProvider` and secure internal routes using the `<ProtectedRoute />` component.

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from 'ssap/frontend';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider authCheckUrl="/api/auth-check">
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes Block */}
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

```

### 2. Consuming Auth State in Components (`Dashboard.jsx`)

Use the `useAuth` hook to access the logged-in user details or display loading states while the initial check finishes.

```jsx
import React from 'react';
import { useAuth } from 'ssap/frontend';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking auth state...</div>;

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>This page is fully protected from unauthenticated guests.</p>
    </div>
  );
}

```

---

## API Reference

### Backend Exports (`ssap/backend`)

* `initSession(secretKey, isProduction)`: Configures cookie-backed express sessions. Disables `secure` flag on localhost when `isProduction` is false.
* `requireAuth(req, res, next)`: Express middleware that blocks incoming requests if `req.session.userId` is missing. Returns a `401 Unauthorized` response.

### Frontend Exports (`ssap/frontend`)

* `<AuthProvider authCheckUrl="/api/auth-check">`: Handles checking current cookie status on boot. Caches context values globally.
* `useAuth()`: Access global hook context properties: `{ user, setUser, loading }`.
* `<ProtectedRoute redirectTo="/login" />`: Route-level element guarding children paths using `react-router-dom` standard `<Outlet />`.

---

## 🛠️ Backend Usage (Express)

Import server-side helpers from `ssap/backend`.

```javascript
import express from 'express';
import { initSession, requireAuth } from 'ssap/backend';

const app = express();
app.use(express.json());

// 1. Initialize session middleware with a secret key
app.use(initSession('your-secure-dev-secret-key', false)); // Set second param to true in production (HTTPS)

// 2. Login Route (Set session details on successful authentication)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials here...
  if (username === 'admin' && password === 'password') {
    req.session.userId = 1;
    req.session.username = username;
    return res.json({ authenticated: true, message: 'Logged in!' });
  }
  
  return res.status(401).json({ authenticated: false, error: 'Invalid credentials' });
});

// 3. Auth Check Route (Used by React to verify active sessions)
app.get('/api/auth-check', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  return res.status(401).json({ authenticated: false });
});

// 4. Logout Route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid');
    return res.json({ authenticated: false });
  });
});

// 5. Protect sensitive endpoints using the middleware
app.get('/api/dashboard-data', requireAuth, (req, res) => {
  res.json({ message: 'Welcome to your private dashboard data!' });
});

```

---

## 💻 Frontend Usage (React + React Router)

Import frontend context and route wrappers from `ssap/frontend`.

### 1. Setup Your App Routing (`App.jsx`)

Wrap your routing setup inside `AuthProvider` and secure internal routes using the `<ProtectedRoute />` component.

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from 'ssap/frontend';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider authCheckUrl="/api/auth-check">
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes Block */}
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

```

### 2. Consuming Auth State in Components (`Dashboard.jsx`)

Use the `useAuth` hook to access the logged-in user details or display loading states while the initial check finishes.

```jsx
import React from 'react';
import { useAuth } from 'ssap/frontend';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking auth state...</div>;

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>This page is fully protected from unauthenticated guests.</p>
    </div>
  );
}

```

---

## API Reference

### Backend Exports (`ssap/backend`)

* `initSession(secretKey, isProduction)`: Configures cookie-backed express sessions. Disables `secure` flag on localhost when `isProduction` is false.
* `requireAuth(req, res, next)`: Express middleware that blocks incoming requests if `req.session.userId` is missing. Returns a `401 Unauthorized` response.

### Frontend Exports (`ssap/frontend`)

* `<AuthProvider authCheckUrl="/api/auth-check">`: Handles checking current cookie status on boot. Caches context values globally.
* `useAuth()`: Access global hook context properties: `{ user, setUser, loading }`.
* `<ProtectedRoute redirectTo="/login" />`: Route-level element guarding children paths using `react-router-dom` standard `<Outlet />`.
#   s s a p  
 