
-- ── Validation constraints (idempotent) ─────────────────
DO $$ BEGIN
  ALTER TABLE public.players
    ADD CONSTRAINT players_ign_not_empty CHECK (length(trim(ign)) > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.players
    ADD CONSTRAINT players_win_rate_range CHECK (win_rate >= 0 AND win_rate <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.players
    ADD CONSTRAINT players_age_range CHECK (age >= 0 AND age <= 120);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.players
    ADD CONSTRAINT players_matches_nonneg CHECK (matches >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.players
    ADD CONSTRAINT players_twins_nonneg CHECK (tournament_wins >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.players
    ADD CONSTRAINT players_years_nonneg CHECK (years_active >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.news_items
    ADD CONSTRAINT news_title_not_empty CHECK (length(trim(title)) > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.tournament_meta
    ADD CONSTRAINT tmeta_name_not_empty CHECK (length(trim(name)) > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.tournament_schedule
    ADD CONSTRAINT tsched_opp_not_empty CHECK (length(trim(opponent)) > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.tournament_standings
    ADD CONSTRAINT tstand_team_not_empty CHECK (length(trim(team)) > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.tournament_standings
    ADD CONSTRAINT tstand_w_nonneg CHECK (w >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.tournament_standings
    ADD CONSTRAINT tstand_l_nonneg CHECK (l >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Audit log table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  entity text NOT NULL,
  entity_id text,
  action text NOT NULL,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON public.audit_logs(entity, entity_id);

-- ── Audit trigger function ──────────────────────────────
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  em  text;
BEGIN
  BEGIN
    SELECT email INTO em FROM auth.users WHERE id = uid;
  EXCEPTION WHEN OTHERS THEN em := NULL;
  END;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs(actor_id, actor_email, entity, entity_id, action, changes)
    VALUES (uid, em, TG_TABLE_NAME, OLD.id::text, TG_OP, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs(actor_id, actor_email, entity, entity_id, action, changes)
    VALUES (uid, em, TG_TABLE_NAME, NEW.id::text, TG_OP,
            jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    RETURN NEW;
  ELSE
    INSERT INTO public.audit_logs(actor_id, actor_email, entity, entity_id, action, changes)
    VALUES (uid, em, TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$$;

-- ── Attach triggers ─────────────────────────────────────
DROP TRIGGER IF EXISTS trg_players_audit ON public.players;
CREATE TRIGGER trg_players_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS trg_news_audit ON public.news_items;
CREATE TRIGGER trg_news_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.news_items
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS trg_tmeta_audit ON public.tournament_meta;
CREATE TRIGGER trg_tmeta_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.tournament_meta
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS trg_tsched_audit ON public.tournament_schedule;
CREATE TRIGGER trg_tsched_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.tournament_schedule
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS trg_tstand_audit ON public.tournament_standings;
CREATE TRIGGER trg_tstand_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.tournament_standings
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
