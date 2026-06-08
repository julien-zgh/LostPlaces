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

<img width="1488" height="959" alt="1" src="https://github.com/user-attachments/assets/5b0c4d8d-a91e-48ae-ab08-3aa584662153" />


### Map View

<img width="1487" height="959" alt="9" src="https://github.com/user-attachments/assets/e79b38b5-5952-4cd1-9255-f2082e7a553e" />


### Location Details

<img width="1487" height="959" alt="10" src="https://github.com/user-attachments/assets/923e5c18-2e6f-4363-8deb-60cab09666f8" />


### Explorer Dashboard

<img width="1487" height="959" alt="5" src="https://github.com/user-attachments/assets/8766e036-4b18-4f43-a6b1-c88ca908fcaa" />


### Admin Dashboard

<img width="1487" height="959" alt="8" src="https://github.com/user-attachments/assets/834f0113-3f8e-49fa-8a39-4e30e0634e04" />

### Location Submission

<img width="1487" height="959" alt="6" src="https://github.com/user-attachments/assets/f1ed87ca-a17f-4f47-9c0d-f3847804de9f" />
<img width="1487" height="959" alt="7" src="https://github.com/user-attachments/assets/4300a8bb-18ad-437a-bf15-82ffedb67ca9" />

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

This project was developed as a final year project for university.
All rights reserved.
