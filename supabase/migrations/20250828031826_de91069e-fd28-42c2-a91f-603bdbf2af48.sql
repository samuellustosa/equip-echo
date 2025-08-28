-- Primeiro, vamos garantir que a tabela users tenha a estrutura correta
-- Se já existir, isso não causará erro

-- Criar enum para roles se não existir
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('Admin', 'Manager', 'User');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alterar a coluna role para usar o enum
ALTER TABLE public.users 
ALTER COLUMN role TYPE public.user_role USING role::public.user_role;

-- Garantir que temos um usuário admin padrão
INSERT INTO public.users (name, email, role) 
VALUES ('Administrador', 'admin@sistema.com', 'Admin'::public.user_role)
ON CONFLICT (email) DO NOTHING;

-- Criar função para automaticamente criar perfil de usuário quando um usuário for criado no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir na tabela users quando um novo usuário for criado no auth
  INSERT INTO public.users (name, email, role)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    NEW.email, 
    'User'::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função quando um usuário for criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();