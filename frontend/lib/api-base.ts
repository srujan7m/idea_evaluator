// Configure the backend API base via NEXT_PUBLIC_API_BASE for Vercel/production.
// Fallback to localhost for local development.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
