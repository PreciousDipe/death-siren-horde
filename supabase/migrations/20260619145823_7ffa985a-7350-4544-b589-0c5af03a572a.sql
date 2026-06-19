
-- ============ contact_messages ============
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  role text,
  ign text,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(message) BETWEEN 1 AND 4000
  );

CREATE POLICY "Admins can read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ match_stats ============
CREATE TABLE public.match_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_date date NOT NULL DEFAULT CURRENT_DATE,
  battle_id text,
  result text NOT NULL CHECK (result IN ('WIN','LOSE')),
  hero text NOT NULL,
  role text NOT NULL,
  kills int NOT NULL DEFAULT 0,
  deaths int NOT NULL DEFAULT 0,
  assists int NOT NULL DEFAULT 0,
  gold int NOT NULL DEFAULT 0,
  hero_damage int NOT NULL DEFAULT 0,
  turret_damage int NOT NULL DEFAULT 0,
  damage_taken int NOT NULL DEFAULT 0,
  teamfight_participation int NOT NULL DEFAULT 0,
  is_mvp boolean NOT NULL DEFAULT false,
  duration_minutes numeric(5,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_match_stats_player_date ON public.match_stats (player_id, match_date DESC);

GRANT SELECT ON public.match_stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.match_stats TO authenticated;
GRANT ALL ON public.match_stats TO service_role;
ALTER TABLE public.match_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match stats are public"
  ON public.match_stats FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage match stats"
  ON public.match_stats FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_match_stats_updated
  BEFORE UPDATE ON public.match_stats
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ Tighten profiles SELECT ============
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Approved profiles are public"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow anon to read approved profiles (for the public roster)
GRANT SELECT ON public.profiles TO anon;
