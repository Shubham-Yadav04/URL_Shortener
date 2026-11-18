# 🔗 Shorten.it - URL Shortener & Real-Time Analytics Platform

**Shorten.it** is a full-stack, enterprise-grade URL shortener and real-time analytics web application. Built with a modern **Next.js 16 (React 19)** frontend and a high-throughput **Spring Boot 4 (Java 17)** backend powered by **Apache Kafka**, **Redis**, and **PostgreSQL**.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Authorization
- **Cookie-based JWT Authentication**: Secure credential and Google OAuth2 login/signup with HTTP-only cookies; accounts are matched by normalized email and OAuth accounts can add password login from dashboard settings.
- **Protected Dashboard**: Client-side and server-side route protection ensuring unauthenticated users are redirected to login.
- **Session Management**: Persistent auth state with automatic `/user/me` verification.

### 2. ⚡ Fast URL Shortening & Management
- **Custom & Auto Short Codes**: Generate short links instantaneously for long URLs.
- **Custom-code availability**: Redis Bloom-filter membership plus an authoritative database uniqueness check.
- **Optional expiry**: Set an expiry date at creation; expired links return HTTP 410 and no longer redirect.
- **Unique visitors**: Approximate per-link unique visitor counts use Redis HyperLogLog and store hashed visitor identifiers.
- **QR Code Generation**: Automatically generates crisp SVG QR codes for every shortened URL using ZXing (`com.google.zxing`) and `qrcode.react`.
- **Link Copy & Share**: One-click link copying to clipboard with visual feedback notifications.
- **URL Security Options**: Support for password-protected links and custom redirection configurations.

### 3. 🚀 High-Performance Redirection & Kafka Analytics Pipeline
- **Redis Caching**: Ultra-fast short-code lookup using Redis (`RedisConfig`, `RedisMappingDTO`) to minimize database queries during URL redirection.
- **Asynchronous Event Ingestion (Kafka)**: Click events are pushed to an Apache Kafka topic asynchronously (`KafkaConfig`), preventing analytics overhead from slowing down redirection response times.
- **IP & User-Agent Parsing**: Resolves geographical locations (Country), Device Categories (Mobile, Desktop, Tablet), and Platforms (OS/Browsers) from incoming request metadata.

### 4. 📊 Interactive Analytics Dashboard
- **Executive Metrics**: Summary cards displaying Total Clicks, Top Country Location, Top Device Type, and Top Platform.
- **Last 7 Days Click Traffic Bar Graph (`Last7DaysBarGraph`)**:
  - Independent component embedded in the main analytics view and structured via Next.js Parallel Routes (`@bargraph` slot).
  - Fetches 7-day click count dynamically from `/analytic/7Day/{mappingId}` inside `useEffect` and manages data in `useState`.
  - Renders proportional height bar visuals, day labels (Mon-Sun), total click metrics, and hover tooltips showing exact click counts and dates.
- **Detailed Analytics View (`DetailedAnalyticsView`)**:
  - Tabbed breakdown across **Country**, **Device**, and **Platform**.
  - Dynamic search filtering by country name.
  - Percentage distribution progress bars and click counts per metric.

### 5. 🎨 Modern Dark Theme & UX Design System
- Built with **Tailwind CSS**, **Framer Motion (`motion/react`)**, and **Lucide React** icons.
- Glassmorphism overlays, smooth transitions, interactive hover micro-animations, and responsive off-canvas mobile drawer sidebar (`SidebarContext`).
- **Next.js App Router Parallel Routes**: Utilizes `@sidebar`, `@bargraph`, and `@auth` slot structures.

---

## 🏗️ System Architecture

```
[ User Browser ]
       │
       ├───► [ Next.js 16 Frontend ] (Port 3000)
       │          ├── React 19 App Router & Parallel Routes (@sidebar, @bargraph)
       │          ├── Context Providers (AuthContext, AnalyticContext, SidebarContext)
       │          └── Components (AnalyticsView, Last7DaysBarGraph, DetailedAnalyticsView)
       │
       └───► [ Spring Boot 4 Backend API ] (Port 8080)
                  │
                  ├──► [ Security & Auth Filter ] (JWT / Cookies)
                  ├──► [ Redis Cache ] (Fast Short Code Lookup)
                  ├──► [ PostgreSQL Database ] (User, UrlMapping, Analytics persistence)
                  └──► [ Apache Kafka Stream ] (Async Click Event Producer & Consumer)
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend (`/frontend`)
| Technology | Description |
| :--- | :--- |
| **Next.js 16** | React 19 App Router, SSR, Parallel Routes, Layout Slots |
| **React 19** | Modern Hooks (`useState`, `useEffect`, `useMemo`, Context API) |
| **TypeScript** | Type safety across components, interfaces, and DTOs |
| **Tailwind CSS v4** | Modern responsive styling system with custom dark theme |
| **Framer Motion (`motion`)**| Micro-animations and page transition effects |
| **Lucide React** | Sleek icon set |
| **QRCode.react** | SVG QR Code rendering |
| **Axios** | HTTP requests with credentials support |

### Backend (`/Url_Shortener`)
| Technology | Description |
| :--- | :--- |
| **Java 17 & Spring Boot 4.0.3** | Core REST API microservice framework |
| **Spring Security & JJWT** | Stateless authentication & authorization filter |
| **Apache Kafka (`spring-kafka`)** | Asynchronous analytics event streaming |
| **Spring Data Redis** | In-memory key-value caching for URL redirection |
| **Spring Data JPA / Hibernate** | Object-relational mapping |
| **PostgreSQL** | Relational database storage |
| **ZXing (Zebra Crossing)** | Backend QR Code image processing |
| **Lombok** | Boilerplate code reduction (`@Getter`, `@Setter`, `@Builder`) |

---

## 📡 REST API Endpoint Documentation

### Auth Controller (`/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/signup` | Register a new user account | No |
| `POST` | `/user/login` | Authenticate user and issue JWT cookie | No |
| `GET` | `/user/me` | Retrieve authenticated user profile | Yes |
| `POST` | `/user/logout` | Revoke the current refresh token and clear auth cookies | Yes |

### URL Mapping Controller (`/mapping`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/mapping/shorten` | Create a shortened URL for the current user | Yes |
| `GET` | `/mapping/short-code/availability?code={code}` | Check a custom short code | Yes |
| `GET` | `/mapping/user` | Fetch the current user's mappings | Yes |
| `GET` | `/mapping/{mappingId}` | Fetch an owned mapping | Yes |
| `DELETE` | `/mapping/{mappingId}` | Delete an owned mapping | Yes |
| `GET` | `/mapping/{id}/country/` | Breakdown analytics by country | Yes |
| `GET` | `/mapping/{id}/device/` | Breakdown analytics by device | Yes |
| `GET` | `/mapping/{id}/platform/` | Breakdown analytics by platform | Yes |

### Analytics Controller (`/analytic`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/analytic/summary/{mappingId}` | Click metrics and approximate unique visitors | Yes |
| `GET` | `/analytic/7Day/{mappingId}` | 7-day daily click count analysis for bar chart | Yes |

### Redirection Controller
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/r/{shortCode}` | Redirect or request the password for a protected link |

---

## 🚀 Getting Started & Setup Guide

### Prerequisites
- **Node.js**: v18+ and `npm`
- **Java JDK**: 17 or higher
- **Maven**: 3.8+
- **PostgreSQL**: Running on port `5432`
- **Redis Server**: Running on port `6379`
- **Apache Kafka**: Running on port `9092`

---

### Backend Setup (`Url_Shortener`)

Configure the environment variables listed in [`Url_Shortener/.env.example`](../Url_Shortener/.env.example) before starting the backend. Spring Boot does not load that example file automatically: set those values in your shell or deployment environment. `JWT_SECRET` must be a unique random value of at least 32 bytes. Previously committed database, Redis, OAuth, and signing credentials must be rotated. Google sign-in buttons are available in the frontend; configure valid Google OAuth client credentials and the provider redirect URI on the backend to use them. For cross-site HTTPS deployments set `COOKIE_SECURE=true` and `COOKIE_SAME_SITE=None`, and keep `FRONTEND_ORIGIN` explicit.

### Consolidating existing accounts with duplicate emails

Back up the PostgreSQL database before deploying this account-uniqueness change. Run the one-time, transactional consolidation script from the repository root before starting the updated backend:

```powershell
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f .\Url_Shortener\src\main\resources\db\migration\V1__merge_duplicate_user_emails.sql
```

For each normalized email, the script keeps the password-enabled account when one exists (otherwise the smallest user ID), moves URL mappings and refresh tokens to that account, unions OAuth providers, removes the duplicate user rows, and creates a case-insensitive unique email index. Existing URL mappings, including duplicate destinations, remain available; the backend prevents creating another mapping for the same account and destination.

1. **Configure the environment**:
   Use `Url_Shortener/.env.example` as a reference and set its variables in your shell or deployment environment. Spring Boot does not load that example file automatically. At minimum, configure the database, Redis, Kafka, `JWT_SECRET`, `BASE_URL`, `BASE_SHORT_URL`, and `FRONTEND_ORIGIN`. Configure Google OAuth credentials and the provider callback URL to enable Google sign-in.

2. **Build and Run** from the repository root:
   ```bash
   cd Url_Shortener
   .\mvnw.cmd spring-boot:run
   ```
   The backend server will start at `http://localhost:8080`.

---
### Frontend Setup (`frontend`)

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
   Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BACKEND_URL` to the backend origin.

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will be live at `http://localhost:3000`.

---

## 📁 Directory Structure

```
UrlShortener/
├── Url_Shortener/                     # Spring Boot Backend
│   ├── src/main/java/com/example/Url_Shortener/
│   │   ├── Configuration/             # Security, Kafka, Redis configs
│   │   ├── Controller/                # REST Controllers
│   │   ├── DTO/                       # Data Transfer Objects
│   │   ├── ExceptionHandler/          # Global Exception Handling
│   │   ├── Filter/                    # Auth Filter
│   │   ├── Modal/                     # JPA Entities
│   │   ├── Repository/                # JPA Repositories
│   │   └── Services/                  # Business Logic Services
│   └── pom.xml
│
└── frontend/                          # Next.js 16 Frontend
    ├── app/                           # App Router
    │   ├── dashboard/                 # Dashboard Layout & Routes
    │   │   ├── @sidebar/              # Sidebar Parallel Route Slot
    │   │   └── @bargraph/             # 7-Day Bar Graph Parallel Route Slot
    │   ├── login/                     # Login Page
    │   ├── signup/                    # Signup Page
    │   └── layout.tsx                 # Root Layout
    ├── components/                    # React Components
    │   └── dashboard/
    │       ├── AnalyticView.tsx       # Main Analytics Overview
    │       ├── Last7DaysBarGraph.tsx  # 7-Day Click Traffic Bar Chart Component
    │       ├── DetailedAnalyticsView.tsx # Country, Device, Platform breakdown
    │       ├── HomeView.tsx           # Dashboard Home View
    │       └── RegisterView.tsx       # URL Registration Form
    ├── context/                       # Context Providers (Auth, Analytic, Sidebar)
    └── package.json
```

---

## 📄 License
This project is open source and available under the MIT License.
