-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  zalo TEXT,
  class TEXT,
  course TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hold', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy for reading students (all authenticated users can read)
CREATE POLICY "Anyone can view students" 
ON public.students 
FOR SELECT 
USING (true);

-- Create policy for inserting students (all authenticated users can insert)
CREATE POLICY "Authenticated users can insert students" 
ON public.students 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy for updating students (all authenticated users can update)
CREATE POLICY "Authenticated users can update students" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (true);

-- Create policy for deleting students (all authenticated users can delete)
CREATE POLICY "Authenticated users can delete students" 
ON public.students 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate student code
CREATE OR REPLACE FUNCTION public.generate_student_code()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(student_code FROM 3) AS INTEGER)), 0) + 1 
  INTO next_num 
  FROM public.students;
  
  NEW.student_code := 'HV' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate student code
CREATE TRIGGER generate_student_code_trigger
BEFORE INSERT ON public.students
FOR EACH ROW
WHEN (NEW.student_code IS NULL OR NEW.student_code = '')
EXECUTE FUNCTION public.generate_student_code();