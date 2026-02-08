import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (import.meta.env.DEV && (!url || !key)) {
  console.warn(
    "[valentine] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. " +
    "The app will run without a backend — letters won't be saved or shared.",
  );
}

export const supabase =
  url && key ? createClient(url, key) : null;
