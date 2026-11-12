/** Supabase configuration. The service-role key is read only on the server and never sent to browsers. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the account features (sign-in, Device Health dashboard) are configured for this deployment. */
export const accountsEnabled = Boolean(supabaseUrl && supabaseAnonKey);
