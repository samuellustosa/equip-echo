import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
// Local type definitions to avoid Supabase types issues
export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export type NewUser = Omit<UserProfile, 'id' | 'created_at'>;
export type UpdatedUser = Partial<Omit<UserProfile, 'id' | 'created_at'>>;

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