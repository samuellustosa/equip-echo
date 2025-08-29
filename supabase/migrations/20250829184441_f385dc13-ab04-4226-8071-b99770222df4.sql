-- Primeiro, vamos inserir o usuário que já existe no auth mas não tem perfil
INSERT INTO public.users (name, email, role) 
VALUES ('Admin User', 'sous31075@gmail.com', 'Admin');

-- Vamos verificar se o trigger handle_new_user está ativo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.users (name, email, role)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    NEW.email, 
    'User'
  );
  RETURN NEW;
END;
$$;

-- Recriar o trigger para garantir que funciona
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();