# Source Tree Analysis

This document describes the organization of the Dienggo project.

## Directory Structure

```text
dienggo/
├── app/                 # Next.js App Router (Pages & API)
│   ├── (auth)/          # Authentication-related routes
│   ├── admin/           # Admin Dashboard routes
│   ├── api/             # API Endpoints
│   ├── booking/         # Booking flow pages
│   ├── villa/           # Villa listing and detail pages
│   ├── hotel-cabin/     # Cabin listing and detail pages
│   ├── jeep/            # Jeep rental listing and detail pages
│   └── wisata/          # Tour listing and detail pages
├── components/          # Reusable UI Components
│   └── admin/           # Components exclusive to the Admin UI
├── db/                  # Database Layer
│   └── schema/          # Drizzle ORM Schema Definitions
├── lib/                 # Shared Utilities and Libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── s3.ts            # AWS S3 upload logic
│   └── supabase.ts      # Supabase client initialization
├── public/              # Static Assets (Images, Icons)
├── messages/            # I18n Translation Files (JSON)
├── i18n/                # Next-intl configuration
└── drizzle/             # Drizzle Migrations and Meta
```

## Critical Files

- `package.json`: Project dependencies and scripts.
- `next.config.ts`: Next.js configuration.
- `drizzle.config.ts`: Database connection and schema path.
- `seed-admin.ts`: Script to seed the initial admin user.
- `.env.local`: Environment variables (Database URL, S3 credentials, etc.).
