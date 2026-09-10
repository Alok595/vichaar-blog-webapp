# Vichaar Editorial Broadsheet (Frontend)

Welcome to the frontend application for **Vichaar**, a beautifully crafted, vintage newspaper-themed editorial web application. This project reimagines the modern digital blog as an authentic, 1920s-style broadsheet journal.

## 🗞️ Features & Design

- **Vintage Broadsheet Aesthetics**: Immersive, fully responsive newspaper layout featuring datelines, serif typography, and multi-column editorial grids.
- **Categorized Sections**: Strict categorization ensuring visitors only see relevant content when browsing specific bureaus (e.g., Engineering, Culture, Games).
- **Author Desk Portal**: A secure, themed authentication portal for authors to log in and manage their dispatches.
- **Micro-Interactions & Animations**: Features delightful details, including a custom "Wanted Monkey" interactive error state for failed login attempts.
- **Dark Edition**: Fully supported dark mode theme ("Late Night Edition") with inverted colors that maintain the authentic paper aesthetic.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router) with Turbopack for ultra-fast development.
- **Styling**: Tailwind CSS combined with custom vintage CSS animations and layouts.
- **State Management**: Zustand / Context (via `useAuthStore`).
- **Icons**: Lucide React for crisp, scalable iconography.

## 🛠️ Getting Started

First, ensure your backend server is running on `localhost:5000`.

Then, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Structure

- `src/app/`: Next.js App Router pages (Front Page, Login, Admin Desk).
- `src/components/`: Reusable UI components (Newspaper layout elements, Navbars).
- `src/lib/`: API utilities and authentication state management.
- `public/`: Static assets, including authentic paper textures and woodcut engravings.

---
*Built with craftsmanship and a dedication to "Depth Over Velocity."*
