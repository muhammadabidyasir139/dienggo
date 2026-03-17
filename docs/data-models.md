# Data Models

This document outlines the database schema used in the Dienggo project, managed via Drizzle ORM and PostgreSQL.

## Tables

### users
Stores user account information and roles.
- `id` (uuid): Primary Key.
- `email` (text): Unique, Not Null.
- `password` (text): Hashed password.
- `name` (text): User's full name.
- `role` (text): Default "customer".
- `createdAt` (timestamp).
- `updatedAt` (timestamp).

### villas / cabins
Stores details for villas and cabins (identical structure).
- `id` (uuid): Primary Key.
- `slug` (text): Unique, Not Null.
- `nama` (text): Not Null.
- `harga` (integer): Not Null.
- `rating` (real): Default 0.
- `ulasan` (integer): Default 0.
- `lokasi` (text).
- `koordinat` (text).
- `kamarTidur` (integer).
- `maksTamu` (integer).
- `kamarMandi` (integer).
- `fasilitasUtama` (jsonb): Array of features.
- `deskripsi` (text).
- `fotoUtama` (text).
- `galeri` (jsonb): Array of image URLs.
- `wisataTerdekat` (jsonb).
- `isActive` (boolean).
- `createdAt` (timestamp).
- `updatedAt` (timestamp).

### wisata
Stores tour/destination details.
- `id` (uuid): Primary Key.
- `slug` (text): Unique.
- `nama` (text).
- `harga` (integer).
- `rating` (real).
- `ulasan` (text).
- `lokasi` (text).
- `koordinat` (text).
- `durasiWisata` (text).
- `kontak` (text).
- `bahasa` (text).
- `fasilitas` (jsonb).
- `narasi` (jsonb).
- `fotoUtama` (text).
- `galeri` (jsonb).
- `videoReels` (jsonb).
- `rundown` (jsonb).
- `isActive` (boolean).
- `createdAt`, `updatedAt`.

### jeeps
Stores jeep rental/tour details.
- `id` (uuid): Primary Key.
- `slug`, `nama`, `harga`, `rating`, `ulasan`.
- `maksOrang` (integer).
- `durasi` (text).
- `destinasiCount` (integer).
- `fotoUtama`, `galeri`.
- `destinasi` (jsonb).
- `isiPaket` (jsonb).
- `kebijakan` (jsonb).
- `isActive`, `createdAt`, `updatedAt`.

### bookings
Stores all booking records.
- `id` (uuid): Primary Key.
- `kodeBooking` (text): Unique.
- `namaLengkap`, `email`, `telepon` (text).
- `permintaan` (text).
- `tipeItem` (text): "villa", "cabin", "jeep", or "wisata".
- `checkIn`, `checkOut`, `tanggal` (date).
- `jumlahTamu` (integer).
- `subtotal`, `pajak`, `total` (integer).
- `metodeBayar` (text).
- `status` (text): "unpaid", "paid", "cancelled", "refunded".
- `villaId` (uuid): References `villas.id`.
- `cabinId` (uuid): References `cabins.id`.
- `jeepId` (uuid): References `jeeps.id`.
- `wisataId` (uuid): References `wisata.id`.
- `createdAt`, `updatedAt`.
