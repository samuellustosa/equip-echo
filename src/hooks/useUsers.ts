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
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao buscar usuários: " + error.message);
        console.error("Fetch users error:", error);
        return;
      }

      setUsers(data as UserProfile[]);
    } catch (error) {
      toast.error("Erro inesperado ao buscar usuários.");
      console.error("Unexpected error in fetchUsers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (user: NewUser) => {
    try {
      // Validação básica
      if (!user.name.trim()) {
        toast.error("Nome é obrigatório.");
        return;
      }

      if (!user.email.trim()) {
        toast.error("Email é obrigatório.");
        return;
      }

      // Verificar se email já existe
      const { data: existingUsers } = await supabase
        .from("users")
        .select("email")
        .eq("email", user.email.toLowerCase().trim());

      if (existingUsers && existingUsers.length > 0) {
        toast.error("Este email já está cadastrado no sistema.");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          ...user,
          email: user.email.toLowerCase().trim(),
          name: user.name.trim()
        })
        .select();

      if (error) {
        toast.error("Erro ao adicionar usuário: " + error.message);
        console.error("Add user error:", error);
        return;
      }

      toast.success(`Usuário "${user.name}" adicionado com sucesso!`);
      await fetchUsers(); // Recarregar a lista
    } catch (error) {
      toast.error("Erro inesperado ao adicionar usuário.");
      console.error("Unexpected error in addUser:", error);
    }
  };

  const updateUser = async (id: string, updates: UpdatedUser) => {
    try {
      // Validação básica
      if (updates.name && !updates.name.trim()) {
        toast.error("Nome não pode estar vazio.");
        return;
      }

      if (updates.email && !updates.email.trim()) {
        toast.error("Email não pode estar vazio.");
        return;
      }

      // Se o email está sendo atualizado, verificar se não existe
      if (updates.email) {
        const { data: existingUsers } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", updates.email.toLowerCase().trim())
          .neq("id", parseInt(id));

        if (existingUsers && existingUsers.length > 0) {
          toast.error("Este email já está cadastrado no sistema.");
          return;
        }
      }

      const cleanUpdates = {
        ...updates,
        ...(updates.email && { email: updates.email.toLowerCase().trim() }),
        ...(updates.name && { name: updates.name.trim() })
      };

      const { error } = await supabase
        .from("users")
        .update(cleanUpdates)
        .eq("id", parseInt(id));

      if (error) {
        toast.error("Erro ao atualizar usuário: " + error.message);
        console.error("Update user error:", error);
        return;
      }

      toast.success("Usuário atualizado com sucesso!");
      await fetchUsers(); // Recarregar a lista
    } catch (error) {
      toast.error("Erro inesperado ao atualizar usuário.");
      console.error("Unexpected error in updateUser:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", parseInt(id));

      if (error) {
        toast.error("Erro ao remover usuário: " + error.message);
        console.error("Delete user error:", error);
        return;
      }

      toast.success("Usuário removido com sucesso!");
      await fetchUsers(); // Recarregar a lista
    } catch (error) {
      toast.error("Erro inesperado ao remover usuário.");
      console.error("Unexpected error in deleteUser:", error);
    }
  };

  return { users, isLoading, fetchUsers, addUser, updateUser, deleteUser };
}