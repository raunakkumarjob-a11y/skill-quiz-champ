-- Drop existing quiz policies that don't allow admin access
DROP POLICY IF EXISTS "Quiz conductors can update their quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Quiz conductors can delete their quizzes" ON public.quizzes;

-- Create new policies with admin access
CREATE POLICY "Quiz conductors and admins can update quizzes"
ON public.quizzes
FOR UPDATE
USING (
  auth.uid() = conducted_by 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Quiz conductors and admins can delete quizzes"
ON public.quizzes
FOR DELETE
USING (
  auth.uid() = conducted_by 
  OR has_role(auth.uid(), 'admin'::app_role)
);