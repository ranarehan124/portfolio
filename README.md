# Rehan Tahir — Portfolio

A premium, Awwwards-quality portfolio website with a complete Enterprise Admin CMS. Built with React 19, TypeScript, Three.js, and Node.js.

## Features

### Portfolio Frontend
- **Immersive Hero Section** with animated text, 3D avatar, and particle effects
- **Interactive 3D Physics Playground** using React Three Fiber + Rapier physics (draggable spheres)
- **Smooth Scroll Animations** powered by GSAP ScrollTrigger and Framer Motion
- **Responsive Design** — Desktop, Laptop, Tablet, Mobile, Large Mobile, Ultra Wide
- **Dark Glassmorphism Theme** — Deep blacks (#050505), purple neon (#8B5CF6), blue accents (#60A5FA)
- **Custom Cursor** with magnetic hover effects
- **Contact Section** with form validation (react-hook-form + Zod) and magnetic social links
- **Sections**: Hero, About, Skills, Experience, Services, Projects, 3D Physics, Contact, Footer
- **Lenis Smooth Scroll** for buttery scrolling experience
- **Lazy-loaded 3D** — Physics scene loads via IntersectionObserver for performance

### Admin Dashboard (CMS)
- **Authentication**: JWT login, token refresh, logout, change password, profile management
- **Dashboard Home**: Stats cards (projects, skills, messages, views), recent messages, quick actions
- **16 Fully Functional CRUD Modules**:
  - Projects (with thumbnails, categories, tags, featured toggle, search/filter)
  - Skills (with level bars, category tabs, featured toggle)
  - Experience (with date ranges, highlights, current job toggle)
  - Services (with dynamic features list)
  - Testimonials (with star ratings, avatars, search)
  - Certificates (with credential URLs, images)
  - Education (with field of study, grades, current student toggle)
  - Hero Content (singleton editor with dynamic titles)
  - About Section (singleton editor)
  - Social Links (platform presets, CRUD)
  - Contact Messages (inbox-style, read/unread, detail view, pagination)
  - Media Library (drag-and-drop upload to Cloudinary, copy URL, delete)
  - Resume Upload (PDF/DOC/DOCX, drag-and-drop)
  - SEO Settings (meta, OG, Twitter, robots, canonical)
  - Website Settings (site info, maintenance mode)
  - Profile Settings (name, email, change password)
- **Dark Glassmorphism Admin Theme** — Consistent with the portfolio
- **Responsive Sidebar** with mobile hamburger menu
- **Reusable Components**: DataTable, Modal, Toast, FormField, Toggle, ConfirmDialog, FileUpload, etc.

### Backend API
- **RESTful API** with Express.js + TypeScript
- **MongoDB** with Mongoose ODM (16 models)
- **Authentication**: JWT access + refresh tokens, bcrypt password hashing
- **Middleware**: Auth guard, role-based access (admin/superadmin), rate limiting, CORS, Helmet, request validation (Zod)
- **File Uploads**: Local storage + Cloudinary integration (streamifier)
- **Email**: Nodemailer SMTP integration for contact form notifications
- **API Versioning**: `/api/v1/` prefix
- **Comprehensive Validation**: Server-side Zod schemas for all endpoints
- **Admin Seed**: Auto-creates admin account on first startup
- **Error Handling**: Centralized error handler with proper HTTP status codes

### SEO & Performance
- **Complete SEO**: Meta tags, Open Graph, Twitter Cards, JSON-LD (Person schema)
- **robots.txt** and **sitemap.xml**
- **PWA Manifest** with dark theme
- **Code Splitting**: All admin pages lazy-loaded via React.lazy + Suspense
- **3D Lazy Loading**: Physics scene loaded via IntersectionObserver
- **PerformanceMonitor**: Adaptive Three.js quality
- **Optimized Animations**: GSAP ScrollTrigger with proper cleanup, Framer Motion
- **Image Optimization**: Lazy loading, responsive images

### Security
- **JWT Authentication** with httpOnly cookies
- **Password Hashing** with bcrypt (salt rounds: 12)
- **Rate Limiting** (configurable window/max)
- **CORS** configuration
- **Helmet** security headers
- **Input Validation** on both client (Zod + react-hook-form) and server (Zod)
- **Protected Routes** (both frontend and backend)
- **Role-Based Access Control** (admin / superadmin)

## Technology Stack

### Frontend
| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Language | TypeScript (strict mode) |
| Build Tool | Vite 6 |
| Styling | TailwindCSS 3.4 |
| 3D Engine | Three.js + React Three Fiber |
| Physics | @react-three/rapier |
| Post-Processing | @react-three/postprocessing |
| Animation | GSAP ScrollTrigger, Framer Motion |
| Forms | react-hook-form + Zod |
| Icons | Lucide React |
| Scroll | Lenis |
| HTTP Client | Axios |

### Backend
| Category | Technology |
|----------|-----------|
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| File Upload | Multer + Cloudinary (streamifier) |
| Email | Nodemailer |
| Security | Helmet, CORS, express-rate-limit |
| Validation | Zod |
| Logging | Morgan |

## Folder Structure

```
rehan-tahir-portfolio/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── assets/favicon.svg
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── manifest.json
│   │   └── _redirects
│   ├── src/
│   │   ├── api/                     # Axios client & endpoints
│   │   ├── app/                     # Router & protected routes
│   │   ├── components/
│   │   │   ├── admin/               # Admin UI components
│   │   │   │   ├── forms/           # FormField, Toggle, TagInput
│   │   │   │   ├── layout/          # AdminLayout, Sidebar, Header
│   │   │   │   └── ui/              # DataTable, Modal, Toast, etc.
│   │   │   ├── layout/              # MainLayout, Navbar, LoadingScreen
│   │   │   ├── sections/            # Hero, About, Skills, etc.
│   │   │   ├── three/               # 3D scenes, physics, effects
│   │   │   └── ui/                  # Button, ScrollReveal, etc.
│   │   ├── config/                  # App configuration
│   │   ├── constants/               # Static data & constants
│   │   ├── contexts/                # React contexts
│   │   ├── data/                    # Static fallback data
│   │   ├── hooks/                   # Custom hooks
│   │   │   └── admin/               # Admin data hooks (CRUD)
│   │   ├── pages/
│   │   │   ├── admin/               # 16 admin pages
│   │   │   └── home/                # Portfolio homepage
│   │   ├── services/                # AuthService, CmsService
│   │   ├── styles/                  # CSS (globals, sections, admin)
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── utils/                   # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Environment config
│   │   ├── constants/               # App constants
│   │   ├── controllers/             # 14 controllers
│   │   ├── database/                # MongoDB connection
│   │   ├── middleware/               # Auth, rate limit, upload, error
│   │   ├── models/                  # 16 Mongoose models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Email, Cloudinary, query
│   │   ├── uploads/                 # Local file uploads
│   │   ├── utils/                   # Logger, seed scripts
│   │   ├── validators/              # Zod validation schemas
│   │   └── app.ts                   # Express app entry
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example                     # Environment variable template
├── vercel.json                      # Vercel deployment config
├── render.yaml                      # Render.com deployment config
├── package.json                     # Monorepo root
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/rehantahir/portfolio.git
cd portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. **Start development servers**
```bash
# Start both client and server (from monorepo root)
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:5000`.

### Individual Scripts

```bash
# Client only
cd client && npm run dev

# Server only
cd server && npm run dev
```

## Environment Variables

See `.env.example` for the complete list. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `ADMIN_EMAIL` | Admin account email (auto-seeded) | Yes |
| `ADMIN_PASSWORD` | Admin account password (auto-seeded) | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | For uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | For uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | For uploads |
| `SMTP_HOST` | SMTP server hostname | For emails |
| `SMTP_USER` | SMTP username | For emails |
| `SMTP_PASS` | SMTP password | For emails |
| `CLIENT_URL` | Frontend URL (for CORS) | Yes |

## Local Development

### MongoDB Setup
1. Install MongoDB locally or create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Update `MONGODB_URI` in your `.env` file

### Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Find your cloud name, API key, and API secret in the dashboard
3. Update the `CLOUDINARY_*` variables in `.env`

### Nodemailer Setup
1. If using Gmail, enable 2FA and create an App Password
2. Update `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` in `.env`
3. Set `EMAIL_FROM` and `EMAIL_TO` as needed

### Admin Login
The admin account is auto-seeded on first server startup:
- **Email**: The value of `ADMIN_EMAIL` (default: `admin@rehantahir.com`)
- **Password**: The value of `ADMIN_PASSWORD` (set in `.env`)

Access the admin dashboard at `/admin/login`.

## Production Deployment

### Frontend — Vercel
1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set the root directory to `client`
4. Set the build command to `npm run build`
5. Set the output directory to `dist`
6. Add all environment variables from `.env.example`
7. Deploy

### Backend — Render
1. Create a new Web Service in [Render](https://render.com)
2. Connect your GitHub repository
3. Set the root directory to `server`
4. Set the build command to `npm install && npm run build`
5. Set the start command to `node dist/app.js`
6. Add all environment variables
7. Deploy

### Database — MongoDB Atlas
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Whitelist your server's IP (or use `0.0.0.0/0` for Render)
3. Create a database user
4. Copy the connection string to `MONGODB_URI`

### Production Build
```bash
# Build client
cd client && npm run build

# Build server
cd server && npm run build
```

## Default Admin Credentials (Development Only)

| Field | Value |
|-------|-------|
| Email | `admin@rehantahir.com` |
| Password | *(set in `.env` as `ADMIN_PASSWORD`)* |

**⚠️ Always change the default password before deploying to production!**

## Available Scripts

| Script | Location | Description |
|--------|----------|-------------|
| `npm run dev` | Root | Start both client and server in development |
| `npm run build` | client | Build the React frontend for production |
| `npm run preview` | client | Preview the production build locally |
| `npm run dev` | server | Start the Express server with tsx watch |
| `npm run build` | server | Compile TypeScript to JavaScript |
| `npm start` | server | Run the compiled production server |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection refused | Verify `MONGODB_URI` and ensure MongoDB is running |
| CORS errors | Set `CLIENT_URL` to match your frontend URL |
| 401 on admin routes | Log in at `/admin/login` to get a JWT token |
| Images not uploading | Verify Cloudinary credentials in `.env` |
| Emails not sending | Verify SMTP credentials; Gmail requires App Password |
| 3D scene is slow | The physics scene lazy-loads; check device performance |
| Build fails | Ensure Node.js 18+ and run `npm install` in both `client/` and `server/` |

## Future Improvements

- **Analytics Dashboard** — Real-time visitor tracking with charts
- **Blog System** — Add a blog with MDX support
- **Dark/Light Theme Toggle** — Allow visitors to switch themes
- **i18n** — Multi-language support
- **Testimonials Carousel** — Auto-playing testimonial slider
- **Project Case Studies** — Detailed project pages with galleries
- **CDN Asset Delivery** — Serve static assets via CDN
- **Automated Backups** — Scheduled MongoDB backups
- **WebSocket Notifications** — Real-time admin notifications for new messages
- **E2E Testing** — Playwright or Cypress integration tests
- **CI/CD Pipeline** — GitHub Actions for automated testing and deployment
- **Performance Monitoring** — Sentry or Datadog integration
- **Image Optimization** — Sharp-based image processing on upload
- **Redis Caching** — Cache API responses for better performance
- **Docker Compose** — One-command local development setup

## License

This project is proprietary. All rights reserved.

---

Built with React, Three.js, and Node.js by [Rehan Tahir](https://rehantahir.dev)