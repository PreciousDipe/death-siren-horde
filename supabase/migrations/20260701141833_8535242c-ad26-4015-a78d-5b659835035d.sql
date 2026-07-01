-- 1. Fix security finding: remove email column from public players table
ALTER TABLE public.players DROP COLUMN IF EXISTS email;

-- 2. Normalize image storage: keep only the storage path (not full URL)
UPDATE public.players
SET photo_url = regexp_replace(photo_url, '^https?://[^/]+/storage/v1/object/public/team-assets/', '')
WHERE photo_url LIKE 'http%';

UPDATE public.news_items
SET image_url = regexp_replace(image_url, '^https?://[^/]+/storage/v1/object/public/team-assets/', '')
WHERE image_url LIKE 'http%';

-- 3. Constrain profiles.photo_url to safe storage paths under the user's own folder
CREATE OR REPLACE FUNCTION public.validate_profile_photo_url()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.photo_url IS NULL OR NEW.photo_url = '' THEN
    NEW.photo_url := NULL;
    RETURN NEW;
  END IF;
  IF NEW.photo_url !~ ('^avatars/' || NEW.id::text || '/[A-Za-z0-9._\-]+$') THEN
    RAISE EXCEPTION 'photo_url must be a storage path avatars/<your-user-id>/<filename>';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_profile_photo_url_trigger ON public.profiles;
CREATE TRIGGER validate_profile_photo_url_trigger
BEFORE INSERT OR UPDATE OF photo_url ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profile_photo_url();

-- 4. Storage policies: authenticated users may manage files in their own avatars/{user_id}/ folder
DROP POLICY IF EXISTS "avatars_user_insert" ON storage.objects;
CREATE POLICY "avatars_user_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'team-assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_user_update" ON storage.objects;
CREATE POLICY "avatars_user_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'team-assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_user_delete" ON storage.objects;
CREATE POLICY "avatars_user_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'team-assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);