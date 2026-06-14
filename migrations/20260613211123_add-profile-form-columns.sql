ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS current_job_title text,
  ADD COLUMN IF NOT EXISTS current_company text,
  ADD COLUMN IF NOT EXISTS current_start_date text,
  ADD COLUMN IF NOT EXISTS current_end_date text,
  ADD COLUMN IF NOT EXISTS current_is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS current_responsibilities text,
  ADD COLUMN IF NOT EXISTS highest_degree text,
  ADD COLUMN IF NOT EXISTS field_of_study text,
  ADD COLUMN IF NOT EXISTS institution text,
  ADD COLUMN IF NOT EXISTS graduation_year text,
  ADD COLUMN IF NOT EXISTS portfolio text,
  ADD COLUMN IF NOT EXISTS work_auth text,
  ADD COLUMN IF NOT EXISTS seeking_titles text,
  ADD COLUMN IF NOT EXISTS resume_url text,
  ADD COLUMN IF NOT EXISTS resume_key text;

ALTER TABLE profiles
  ALTER COLUMN preferred_locations TYPE text
  USING CASE
    WHEN preferred_locations IS NULL THEN NULL
    WHEN array_length(preferred_locations, 1) IS NULL THEN NULL
    ELSE array_to_string(preferred_locations, ', ')
  END;
