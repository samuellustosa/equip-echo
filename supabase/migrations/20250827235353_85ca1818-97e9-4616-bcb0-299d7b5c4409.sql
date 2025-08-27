-- This migration creates the missing sectors and responsibles tables
-- that are referenced in the code but don't exist yet

-- Create sectors table
CREATE TABLE IF NOT EXISTS public.sectors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create responsibles table  
CREATE TABLE IF NOT EXISTS public.responsibles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on both tables
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsibles ENABLE ROW LEVEL SECURITY;

-- Create policies for sectors
CREATE POLICY "Allow authenticated read access for sectors" 
ON public.sectors 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated write access for sectors" 
ON public.sectors 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update access for sectors" 
ON public.sectors 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete access for sectors" 
ON public.sectors 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create policies for responsibles
CREATE POLICY "Allow authenticated read access for responsibles" 
ON public.responsibles 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated write access for responsibles" 
ON public.responsibles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update access for responsibles" 
ON public.responsibles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete access for responsibles" 
ON public.responsibles 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Insert default data
INSERT INTO public.sectors (name) VALUES 
  ('TI'),
  ('Administração'),
  ('Produção'),
  ('Manutenção'),
  ('Qualidade')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.responsibles (name) VALUES 
  ('João Silva'),
  ('Maria Santos'),
  ('Pedro Costa'),
  ('Ana Oliveira'),
  ('Carlos Mendes')
ON CONFLICT (name) DO NOTHING;