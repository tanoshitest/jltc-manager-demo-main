-- Add student_type column to students table
ALTER TABLE public.students 
ADD COLUMN student_type text;

-- Insert demo student with type "Kỹ sư"
INSERT INTO public.students (name, student_type, status, class)
VALUES ('Nguyễn Văn Demo', 'ki_su', 'active', 'N4-01');