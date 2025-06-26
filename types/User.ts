export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar_url: string | null;
  google_id: string | null;
  created_at: string;
  updated_at: string;
}
