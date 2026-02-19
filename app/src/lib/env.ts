export const env = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "insecure-dev-secret",
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  LOCAL_AUTH_ENABLED: process.env.LOCAL_AUTH_ENABLED ?? "true",
  LOCAL_ADMIN_USER: process.env.LOCAL_ADMIN_USER ?? "admin",
  LOCAL_ADMIN_PASS: process.env.LOCAL_ADMIN_PASS ?? "admin123",
  LOCAL_RESIDENT_USER: process.env.LOCAL_RESIDENT_USER ?? "residente",
  LOCAL_RESIDENT_PASS: process.env.LOCAL_RESIDENT_PASS ?? "residente123",
};
