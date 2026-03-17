# API Contracts

This document lists the available API routes in the Dienggo project.

## Authentication

### NextAuth
- **Path**: `/api/auth/[...nextauth]`
- **Methods**: GET, POST
- **Description**: Handles user session, login, and registration via NextAuth.js.

## Admin

### File Upload
- **Path**: `/api/admin/upload`
- **Method**: POST
- **Description**: Uploads a file to AWS S3.
- **Payload**: `FormData` containing a `file` field.
- **Constraints**: Requires an active admin session.
- **Returns**: `{ url: string }`.

## Internationalization
The project uses `next-intl` for localization, managed via middleware and the `/i18n` directory.
