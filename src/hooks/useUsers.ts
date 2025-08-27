import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Tipos para a tabela 'users'
export type UserProfile = Tables<'users'>;
export type NewUser = TablesInsert<'users'>;
export type UpdatedUser = TablesUpdate<'users'>;

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Erro ao buscar usuários.");
      console.error(error);
    } else {
      setUsers(data as UserProfile[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (user: NewUser) => {
    // Para simplificar, vamos assumir que o signup já foi feito e estamos a criar o perfil
    const { data, error } = await supabase.from("users").insert(user);
    if (error) {
      toast.error("Erro ao adicionar usuário.");
      console.error(error);
    } else {
      toast.success("Usuário adicionado com sucesso!");
      fetchUsers();
    }
  };

  const updateUser = async (id: string, updates: UpdatedUser) => {
    const { error } = await supabase.from("users").update(updates).eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar usuário.");
      console.error(error);
    } else {
      toast.success("Usuário atualizado com sucesso!");
      fetchUsers();
    }
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover usuário.");
      console.error(error);
    } else {
      toast.success("Usuário removido com sucesso!");
      fetchUsers();
    }
  };

  return { users, isLoading, fetchUsers, addUser, updateUser, deleteUser };
}