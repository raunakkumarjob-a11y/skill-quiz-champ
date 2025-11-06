-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view college members" ON public.profiles;

-- Create a security definer function to get user's college_id without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_college_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT college_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Create a new policy without recursion using the security definer function
CREATE POLICY "Users can view college members"
ON public.profiles
FOR SELECT
USING (
  (college_id IS NOT NULL) 
  AND (college_id = public.get_user_college_id(auth.uid()))
);