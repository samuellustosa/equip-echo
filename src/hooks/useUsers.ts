import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type UserProfile = Tables<'users'>;
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
    const { error } = await supabase.from("users").insert(user);
    if (error) {
      toast.error("Erro ao adicionar usuário.");
      console.error(error);
    } else {
      toast.success("Usuário adicionado com sucesso!");
      fetchUsers();
    }
  };

  const updateUser = async (id: string, updates: UpdatedUser) => {
    const { error } = await supabase.from("users").update(updates).eq("id", parseInt(id));
    if (error) {
      toast.error("Erro ao atualizar usuário.");
      console.error(error);
    } else {
      toast.success("Usuário atualizado com sucesso!");
      fetchUsers();
    }
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", parseInt(id));
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