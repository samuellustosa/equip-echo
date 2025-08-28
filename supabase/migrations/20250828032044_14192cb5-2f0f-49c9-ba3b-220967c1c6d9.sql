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