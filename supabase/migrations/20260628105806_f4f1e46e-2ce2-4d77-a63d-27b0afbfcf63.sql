
-- ============ PLAYERS ============
CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ign text NOT NULL,
  real_name text NOT NULL,
  role text NOT NULL,
  squad text NOT NULL,
  photo_url text,
  verified boolean NOT NULL DEFAULT false,
  player_id text,
  nationality text DEFAULT 'Nigeria',
  flag text DEFAULT '🇳🇬',
  age int,
  years_active int,
  win_rate int,
  matches int,
  tournament_wins int,
  instagram text,
  twitter text,
  youtube text,
  email text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.players TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.players TO authenticated;
GRANT ALL ON public.players TO service_role;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "players_public_read" ON public.players FOR SELECT USING (true);
CREATE POLICY "players_admin_insert" ON public.players FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "players_admin_update" ON public.players FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "players_admin_delete" ON public.players FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER players_touch BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ NEWS ============
CREATE TABLE public.news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text NOT NULL,
  category text,
  content text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_items TO authenticated;
GRANT ALL ON public.news_items TO service_role;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_public_read" ON public.news_items FOR SELECT USING (true);
CREATE POLICY "news_admin_insert" ON public.news_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "news_admin_update" ON public.news_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "news_admin_delete" ON public.news_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER news_touch BEFORE UPDATE ON public.news_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ TOURNAMENT META (singleton-ish: upcoming tournament) ============
CREATE TABLE public.tournament_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tag text,
  target_date timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tournament_meta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_meta TO authenticated;
GRANT ALL ON public.tournament_meta TO service_role;
ALTER TABLE public.tournament_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tmeta_public_read" ON public.tournament_meta FOR SELECT USING (true);
CREATE POLICY "tmeta_admin_insert" ON public.tournament_meta FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tmeta_admin_update" ON public.tournament_meta FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tmeta_admin_delete" ON public.tournament_meta FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tmeta_touch BEFORE UPDATE ON public.tournament_meta FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ SCHEDULE ============
CREATE TABLE public.tournament_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  opponent text NOT NULL,
  time text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tournament_schedule TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_schedule TO authenticated;
GRANT ALL ON public.tournament_schedule TO service_role;
ALTER TABLE public.tournament_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tsched_public_read" ON public.tournament_schedule FOR SELECT USING (true);
CREATE POLICY "tsched_admin_insert" ON public.tournament_schedule FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tsched_admin_update" ON public.tournament_schedule FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tsched_admin_delete" ON public.tournament_schedule FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tsched_touch BEFORE UPDATE ON public.tournament_schedule FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ STANDINGS ============
CREATE TABLE public.tournament_standings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team text NOT NULL,
  w int NOT NULL DEFAULT 0,
  l int NOT NULL DEFAULT 0,
  pts int NOT NULL DEFAULT 0,
  highlight boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tournament_standings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_standings TO authenticated;
GRANT ALL ON public.tournament_standings TO service_role;
ALTER TABLE public.tournament_standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tstand_public_read" ON public.tournament_standings FOR SELECT USING (true);
CREATE POLICY "tstand_admin_insert" ON public.tournament_standings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tstand_admin_update" ON public.tournament_standings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tstand_admin_delete" ON public.tournament_standings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tstand_touch BEFORE UPDATE ON public.tournament_standings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
