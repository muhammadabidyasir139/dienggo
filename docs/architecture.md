# Architecture: Dienggo

This document describes the architectural patterns and technical decisions behind the Dienggo application.

## Architectural Style
Dienggo follows a **Component-Based Monolith** architecture leveraging the **Next.js App Router** framework.

### Layering Strategy

1.  **UI Layer (React Server & Client Components)**:
    - Located in `app/` and `components/`.
    - Server Components are used for data fetching (Direct DB access via Drizzle).
    - Client Components are used for interactivity (Framer Motion, Search Bars).
2.  **Logic Layer (Server Actions & API Routes)**:
    - Data mutations are handled via Server Actions (implicitly in `app/`) or localized utilities in `lib/`.
    - API Routes (`app/api/`) are used for integration with external services (S3 upload) and NextAuth.
3.  **Data Layer (Drizzle ORM & PostgreSQL)**:
    - Located in `db/schema/`.
    - Drizzle ORM provides type-safe queries and schema management.
    - PostgreSQL serves as the persistent data store.

## Technical Decisions

### Authentication
- **NextAuth.js**: Chosen for its robust integration with Next.js and support for multiple provider strategies (Credentials, SSO).

### Database Management
- **Drizzle ORM**: Selected over Prisma for its "SQL-like" simplicity, performance (no heavy runtime), and excellent TypeScript support.
- **Drizzle Kit**: Used for rapid schema prototyping (`db:push`) and visualization (`db:studio`).

### Styling and Animation
- **Tailwind CSS 4**: Used for rapid, utility-first styling with modern CSS features.
- **Framer Motion**: Used to provide premium micro-animations and smooth transitions.

### Internationalization
- **Next-intl**: Provides standardized support for localized routing and message translation.

## Integration Points
- **AWS S3**: Storage for all user-uploaded images and gallery assets.
- **Unsplash/YouTube**: External content providers for listing media.
