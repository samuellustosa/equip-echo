-- Primeiro, vamos corrigir os dados existentes para corresponder ao enum
UPDATE public.users SET role = 'User' WHERE role NOT IN ('Admin', 'Manager', 'User');
UPDATE public.users SET role = 'Admin' WHERE role = 'admin';
UPDATE public.users SET role = 'Manager' WHERE role = 'manager';
UPDATE public.users SET role = 'User' WHERE role = 'user';

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