-- Remover todas as políticas da tabela users primeiro
DROP POLICY IF EXISTS "Allow authenticated users to read their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to insert new users" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to update all users" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to delete users" ON public.users;

-- Remover o default da coluna role
ALTER TABLE public.users ALTER COLUMN role DROP DEFAULT;

-- Criar enum para roles se não existir
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('Admin', 'Manager', 'User');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alterar a coluna role para usar o enum
ALTER TABLE public.users 
ALTER COLUMN role TYPE public.user_role USING role::public.user_role;

-- Agora adicionar o default com o tipo correto
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'User'::public.user_role;

-- Recriar as políticas usando o enum
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

-- Garantir que temos um usuário admin padrão
INSERT INTO public.users (name, email, role) 
VALUES ('Administrador', 'admin@sistema.com', 'Admin'::public.user_role)
ON CONFLICT (email) DO NOTHING;