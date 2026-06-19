
-- Explicit restrictive policy: no client-side role assignment ever
CREATE POLICY "Deny client inserts on user_roles"
  ON public.user_roles AS RESTRICTIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Deny client deletes on user_roles"
  ON public.user_roles AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (false);

CREATE POLICY "Deny client updates on user_roles"
  ON public.user_roles AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
