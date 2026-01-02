-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can update students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can delete students" ON public.students;

-- Create new permissive policies for public access
CREATE POLICY "Anyone can insert students" 
ON public.students 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update students" 
ON public.students 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete students" 
ON public.students 
FOR DELETE 
USING (true);