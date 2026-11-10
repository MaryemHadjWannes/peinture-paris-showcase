// Public build-time configuration. Never put server secrets in VITE_* variables.
export const API_BASE = (
  import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");
