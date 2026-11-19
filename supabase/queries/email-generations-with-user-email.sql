-- =====================================================================================================
-- Who generated which email: email_generations joined with the user's email address.
--
-- Where to run it: Supabase Dashboard > SQL Editor. (Only the SQL Editor / service role can read auth.users.)
-- How: paste ONE section at a time, or select just that section's text and press Run, because the
--      editor shows the result of the last statement only.
--
-- Why a join: email_generations only stores user_id. The email address lives in auth.users.email
--      (the profiles table has no email column).
--
-- This file is NOT a migration. It lives in supabase/queries/ on purpose so the Supabase CLI never applies it.
-- Sections 1 and 2 are read-only. Section 3 is commented out; read its warning before using it.
-- The emails are personal data: be careful with exports and screenshots.
-- =====================================================================================================


-- -----------------------------------------------------------------------------------------------------
-- 1) Every generated email with the user's address, newest first. Read-only.
--    content_json and html_code are left out because they are large; add them if you need them.
--    Change the limit, or add:  where eg.status = 'completed'   (before "order by") to filter.
-- -----------------------------------------------------------------------------------------------------
select
  u.email,
  eg.created_at,
  eg.status,
  eg.email_type,
  eg.design_style,
  eg.subject_line,
  eg.prompt,
  eg.credits_used,
  p.plan_type,
  bp.brand_name,
  u.raw_user_meta_data->>'signup_source' as signup_source,  -- channel tag saved at signup; empty for older accounts
  eg.id as generation_id
from public.email_generations eg
join auth.users u                  on u.id  = eg.user_id
left join public.profiles p        on p.id  = eg.user_id
left join public.brand_profiles bp on bp.id = eg.brand_profile_id
order by eg.created_at desc
limit 200;


-- -----------------------------------------------------------------------------------------------------
-- 2) Usage per person: how many emails each user has generated. Read-only.
-- -----------------------------------------------------------------------------------------------------
select
  u.email,
  count(*)                                         as emails_generated,
  count(*) filter (where eg.status = 'completed')  as completed,
  max(eg.created_at)                               as last_generated
from public.email_generations eg
join auth.users u on u.id = eg.user_id
group by u.email
order by emails_generated desc;


-- -----------------------------------------------------------------------------------------------------
-- 3) OPTIONAL: a saved view you can open in the Table Editor. Commented out on purpose.
--
--    WARNING: never create this view in the "public" schema. Supabase's API exposes public, so a view there
--    that joins auth.users could let the API serve your users' email addresses. The version below puts it in a
--    separate "admin" schema and removes access for the API roles. To use it, remove the /* and */ lines,
--    then run it once. The "admin" schema should then appear in the Table Editor's schema dropdown.
-- -----------------------------------------------------------------------------------------------------
/*
create schema if not exists admin;

create or replace view admin.email_generations_with_user as
select eg.*, u.email as user_email
from public.email_generations eg
join auth.users u on u.id = eg.user_id;

revoke all on schema admin from anon, authenticated;
revoke all on admin.email_generations_with_user from anon, authenticated;
*/
