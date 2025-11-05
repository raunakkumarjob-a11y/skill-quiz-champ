-- Fix 1: Restrict profiles table SELECT to prevent email scraping
-- Remove overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Add restrictive policy: users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Allow viewing profiles within same college
CREATE POLICY "Users can view college members"
ON public.profiles FOR SELECT
USING (
  college_id IS NOT NULL AND
  college_id IN (SELECT college_id FROM public.profiles WHERE id = auth.uid())
);

-- Fix 2: Restrict colleges table to admin-only modifications
-- Remove overly permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update colleges" ON public.colleges;

-- Add admin-only UPDATE policy
CREATE POLICY "Only admins can update colleges"
ON public.colleges FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Remove overly permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create colleges" ON public.colleges;

-- Add admin-only INSERT policy
CREATE POLICY "Only admins can create colleges"
ON public.colleges FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));