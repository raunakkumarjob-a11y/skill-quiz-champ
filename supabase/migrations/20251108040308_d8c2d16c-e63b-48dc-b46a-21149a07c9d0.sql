-- Create storage bucket for quiz images
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-images', 'quiz-images', true);

-- Add image_url column to quizzes table
ALTER TABLE public.quizzes
ADD COLUMN image_url text;

-- Create RLS policies for quiz images bucket
CREATE POLICY "Anyone can view quiz images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'quiz-images');

CREATE POLICY "Authenticated users can upload quiz images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'quiz-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Quiz conductors and admins can update quiz images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'quiz-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Quiz conductors and admins can delete quiz images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'quiz-images' AND
  auth.role() = 'authenticated'
);