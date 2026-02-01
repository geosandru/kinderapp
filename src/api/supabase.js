import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jjejarsvfhldttijkemk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWphcnN2ZmhsZHR0aWprZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDUyMTksImV4cCI6MjA4NTEyMTIxOX0.vMMrgwwmTgIB6oRP67AvvWZ56ZhEeQjJx3HYR6NF7RQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
