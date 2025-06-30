import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nxgkpvxhajxdcsnprmpj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54Z2twdnhoYWp4ZGNzbnBybXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDA2MDQsImV4cCI6MjA2NjgxNjYwNH0.X3KcQ9YszfAeoy36sK5GbAcTYu6Zn-lWWI3OY-qgpWo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);