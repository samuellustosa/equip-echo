-- Criar enum para roles se não existir
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('Admin', 'Manager', 'User');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alterar a coluna role para usar o enum
ALTER TABLE public.users 
ALTER COLUMN role TYPE public.user_role USING role::public.user_role;

-- Adicionar default
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'User'::public.user_role;

-- Recriar as políticas usando o enum para a tabela users
CREATE POLICY "Allow authenticated users to read their own profile" 
ON public.users FOR SELECT 
TO authenticated 
USING (auth.email() = email);

CREATE POLICY "Allow Admin to read all users" 
ON public.users FOR SELECT 
TO authenticated 
USING ((SELECT role FROM public.users WHERE auth.email() = email) = 'Admin'::public.user_role);

CREATE POLICY "Allow Admin to insert new users" 
ON public.users FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT role FROM public.users WHERE auth.email() = email) = 'Admin'::public.user_role);

CREATE POLICY "Allow Admin to update all users" 
ON public.users FOR UPDATE 
TO authenticated 
USING ((SELECT role FROM public.users WHERE auth.email() = email) = 'Admin'::public.user_role);

CREATE POLICY "Allow Admin to delete users" 
ON public.users FOR DELETE 
TO authenticated 
USING ((SELECT role FROM public.users WHERE auth.email() = email) = 'Admin'::public.user_role);

-- Recriar políticas para outras tabelas
CREATE POLICY "Allow authenticated users to read equipments" 
ON public.equipments FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow Admin and Manager to manage equipments" 
ON public.equipments FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.users WHERE auth.email() = email) = ANY(ARRAY['Admin'::public.user_role, 'Manager'::public.user_role]))
WITH CHECK ((SELECT role FROM public.users WHERE auth.email() = email) = ANY(ARRAY['Admin'::public.user_role, 'Manager'::public.user_role]));

CREATE POLICY "Allow authenticated users to read inventory items" 
ON public.inventory_items FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow Admin and Manager to manage inventory items" 
ON public.inventory_items FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.users WHERE auth.email() = email) = ANY(ARRAY['Admin'::public.user_role, 'Manager'::public.user_role]))
WITH CHECK ((SELECT role FROM public.users WHERE auth.email() = email) = ANY(ARRAY['Admin'::public.user_role, 'Manager'::public.user_role]));

CREATE POLICY "Allow authenticated users to read maintenance records" 
ON public.maintenance_records FOR SELECT 
TO authenticated 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow Admin and Manager to manage maintenance records" 
ON public.maintenance_records FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.users WHERE auth.email() = email) = ANY(ARRAY['Admin'::public.user_role, 'Manager'::public.user_role]))
WITH CHECK ((SELECT role FROM public.users WHERE auth.email() = email) = ANY(ARRAY['Admin'::public.user_role, 'Manager'::public.user_role]));

-- Garantir que temos um usuário admin padrão
INSERT INTO public.users (name, email, role) 
VALUES ('Administrador', 'admin@sistema.com', 'Admin'::public.user_role)
ON CONFLICT (email) DO NOTHING;

-- Criar função para automaticamente criar perfil quando usuário faz signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (name, email, role)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    NEW.email, 
    'User'::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();