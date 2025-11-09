-- Create storage bucket for event memories
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-memories', 'event-memories', true);

-- Create event_memories table
CREATE TABLE public.event_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  event_date date,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_memories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view event memories"
ON public.event_memories
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert event memories"
ON public.event_memories
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update event memories"
ON public.event_memories
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete event memories"
ON public.event_memories
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for event memories
CREATE POLICY "Anyone can view event memory images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-memories');

CREATE POLICY "Admins can upload event memory images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'event-memories' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update event memory images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'event-memories' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete event memory images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'event-memories' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger for updated_at
CREATE TRIGGER update_event_memories_updated_at
BEFORE UPDATE ON public.event_memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();