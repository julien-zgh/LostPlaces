# LostPlaces

LostPlaces is a community-driven platform designed for explorers and adventure enthusiasts seeking hidden and unconventional locations. The platform provides a safe and interactive environment where users can discover, share, and discuss unique places around the world.

Whether you're a seasoned explorer or simply curious about lesser-known destinations, LostPlaces helps you uncover hidden treasures while connecting with a community of like-minded adventurers.

---

## 🌟 Features

### Hidden Gems Discovery

Explore unique and lesser-known locations submitted by the community.

### Community Contributions

Users can submit their own locations, upload photos and media, and share their experiences with other explorers.

### Ratings & Reviews

Engage with the community through ratings, reviews, and discussions to help highlight the best discoveries.

### Interactive Maps

Browse locations using an interactive map powered by MapLibre with support for:

* Location markers
* Marker clustering
* Spiderfying overlapping markers
* Satellite and standard map themes
* Route generation to selected locations

### User Dashboard

Users can:

* Save locations to their wishlist
* Track visited places
* Manage submitted locations
* Edit profile information
* View their reviews and activity

### Explorer Dashboard

Explorers can:

* Submit new locations
* Edit existing submissions
* Manage uploaded media
* Track approval status of locations

### Admin Dashboard

Administrators can:

* Manage users
* Review submitted locations
* Approve or reject locations
* Monitor platform statistics
* Send approval/rejection notifications

### Security Features

* Secure authentication
* Protected routes
* Password reset flow
* Two-Factor Authentication (2FA)
* Session-based authentication
* Input sanitization using DOMPurify

---

## 📸 Screenshots

### Homepage

![Homepage](./screenshots/homepage.png)

### Map View

![Map View](./screenshots/map-view.png)

### Location Details

![Location Details](./screenshots/location-details.png)

### User Dashboard

![User Dashboard](./screenshots/user-dashboard.png)

### Explorer Dashboard

![Explorer Dashboard](./screenshots/explorer-dashboard.png)

### Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

### Location Submission

![Location Submission](./screenshots/location-submission.png)

### Reviews & Ratings

![Reviews & Ratings](./screenshots/reviews-ratings.png)

### Authentication

![Authentication](./screenshots/authentication.png)

### Mobile View

![Mobile View](./screenshots/mobile-view.png)

> Replace the image paths above with your actual screenshot locations.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Zustand

### Backend

* Node.js
* Express.js

### Database & Storage

* MongoDB
* Supabase Storage

### Maps & Geolocation

* MapLibre
* react-map-gl/maplibre

### Authentication & Security

* Session Authentication
* Two-Factor Authentication (2FA)
* DOMPurify

### Media & UI

* yet-another-react-lightbox

### Email Services

* Nodemailer
* EmailJS

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB

### Installation

```bash
git clone <repository-url>

cd lostplaces

npm install
```

### Start Frontend

```bash
npm run dev
```

### Start Backend

```bash
npx nodemon src/backend/server.js
```

---

## 🔐 Authentication Features

### Password Reset Flow

1. User requests a password reset.
2. A secure token is generated and stored securely.
3. A reset email is sent to the user.
4. The user accesses the reset link.
5. The password is updated securely after verification.

### Two-Factor Authentication (2FA)

* TOTP-based authentication
* QR code setup
* Microsoft Authenticator compatible
* Secure verification flow
* Protected session handling

---

## 🗺️ Platform Capabilities

### Locations

* Submit locations
* Edit locations
* Delete locations
* Upload media
* View nearby locations
* Save to wishlist
* Mark as visited
* Rate locations
* Leave reviews
* Report abuse

### Maps

* Interactive map interface
* Marker clustering
* Satellite mode
* Standard mode
* Navigation routes
* Location visualization

---

## 🎨 Design

### Primary Colors

| Color      | Hex     |
| ---------- | ------- |
| Grey       | #A3A2A2 |
| Terracotta | #CF7F4A |

---

## 📄 License

This project was developed as a freelance project for LostPlaces.

All rights reserved.
