-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'hod', 'director', 'faculty', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role app_role DEFAULT 'student',
  college_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  conducted_by UUID REFERENCES public.profiles(id),
  quiz_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz registrations table
CREATE TABLE public.quiz_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'present', 'absent')),
  UNIQUE(quiz_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_registrations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Colleges policies (public read, admin write)
CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create colleges"
  ON public.colleges FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update colleges"
  ON public.colleges FOR UPDATE
  TO authenticated
  USING (true);

-- Quizzes policies
CREATE POLICY "Anyone can view quizzes"
  ON public.quizzes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create quizzes"
  ON public.quizzes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = conducted_by);

CREATE POLICY "Quiz conductors can update their quizzes"
  ON public.quizzes FOR UPDATE
  TO authenticated
  USING (auth.uid() = conducted_by);

CREATE POLICY "Quiz conductors can delete their quizzes"
  ON public.quizzes FOR DELETE
  TO authenticated
  USING (auth.uid() = conducted_by);

-- Quiz registrations policies
CREATE POLICY "Users can view registrations"
  ON public.quiz_registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can register for quizzes"
  ON public.quiz_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their registrations"
  ON public.quiz_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample colleges
INSERT INTO public.colleges (name, location, contact_email) VALUES
  ('XYZ Engineering College', 'Mumbai, Maharashtra', 'contact@xyzengineering.edu'),
  ('ABC Institute of Technology', 'Delhi, NCR', 'info@abctech.edu'),
  ('PQR University', 'Bangalore, Karnataka', 'admin@pqruniversity.edu');
