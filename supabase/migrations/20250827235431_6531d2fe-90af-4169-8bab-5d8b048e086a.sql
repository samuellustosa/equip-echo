-- Create users table for the application
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'User',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow authenticated read access for users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated write access for users" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update access for users" 
ON public.users 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete access for users" 
ON public.users 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Insert some default users
INSERT INTO public.users (name, email, role) VALUES 
  ('Administrador', 'admin@example.com', 'Admin'),
  ('João Silva', 'joao@example.com', 'User'),
  ('Maria Santos', 'maria@example.com', 'Manager'),
  ('Pedro Costa', 'pedro@example.com', 'User')
ON CONFLICT (email) DO NOTHING;