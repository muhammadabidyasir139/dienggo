# Project Overview: Dienggo

**Dienggo** is a premium online platform for finding and booking villas, cabins, jeep rentals, and tour packages in the Dieng area.

## Key Features

- **Multi-Category Booking**: Supports Villas, Cabins, Jeeps, and Tour Packages.
- **Modern Search**: Specialized search bars for each category with real-time feedback.
- **Admin Dashboard**: Comprehensive management interface for admins to manage listings, bookings, and image uploads.
- **Localization**: Full support for Indonesian and English languages.
- **Dark Mode**: High-quality dark and light themes.
- **Cloud Storage**: Secure image storage via AWS S3.

## Technical Summary

| Attribute | Value |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Drizzle ORM |
| **Authentication** | NextAuth.js |
| **Styling** | Tailwind CSS 4 & Framer Motion |
| **I18n** | `next-intl` |

## Getting Started

1. **Install Dependencies**: `npm install`
2. **Setup DB**: `npm run db:push`
3. **Seed Admin**: `npx tsx seed-admin.ts`
4. **Run Dev**: `npm run dev`
