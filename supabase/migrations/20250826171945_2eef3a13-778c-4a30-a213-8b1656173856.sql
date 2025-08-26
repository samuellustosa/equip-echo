-- Create equipments table
CREATE TABLE public.equipments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  sector TEXT NOT NULL,
  responsible TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Em Dia',
  maintenance_interval INTEGER NOT NULL DEFAULT 30,
  last_maintenance DATE,
  next_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maintenance_records table
CREATE TABLE public.maintenance_records (
  id BIGSERIAL PRIMARY KEY,
  equipment_id BIGINT NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  responsible TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  minimum INTEGER NOT NULL DEFAULT 5,
  unit TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'Disponível',
  last_movement DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth yet)
CREATE POLICY "Allow all access to equipments" ON public.equipments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to maintenance_records" ON public.maintenance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to inventory_items" ON public.inventory_items FOR ALL USING (true) WITH CHECK (true);