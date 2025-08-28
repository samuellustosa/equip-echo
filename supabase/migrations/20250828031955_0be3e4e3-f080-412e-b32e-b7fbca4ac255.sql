-- Remover políticas de todas as tabelas que dependem da coluna role
-- Tabela users
DROP POLICY IF EXISTS "Allow authenticated users to read their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to insert new users" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to update all users" ON public.users;
DROP POLICY IF EXISTS "Allow Admin to delete users" ON public.users;

-- Tabela equipments
DROP POLICY IF EXISTS "Allow Admin and Manager to manage equipments" ON public.equipments;

-- Tabela inventory_items
DROP POLICY IF EXISTS "Allow Admin and Manager to manage inventory items" ON public.inventory_items;

-- Tabela maintenance_records
DROP POLICY IF EXISTS "Allow Admin and Manager to manage maintenance records" ON public.maintenance_records;