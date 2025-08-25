import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Tipos para a tabela 'inventory_items'
export type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];
export type NewInventoryItem = Database['public']['Tables']['inventory_items']['Insert'];
export type UpdatedInventoryItem = Database['public']['Tables']['inventory_items']['Update'];


export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("id");

    if (error) {
      toast.error("Erro ao buscar itens do inventário.");
      console.error(error);
    } else {
      setInventoryItems(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const addInventoryItem = async (item: NewInventoryItem) => {
    const { error } = await supabase.from("inventory_items").insert(item);
    if (error) {
      toast.error("Erro ao adicionar item.");
      console.error(error);
    } else {
      toast.success("Item adicionado com sucesso!");
      fetchInventory();
    }
  };

  const updateInventoryItem = async (id: number, updates: UpdatedInventoryItem) => {
    const { error } = await supabase.from("inventory_items").update(updates).eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar item.");
      console.error(error);
    } else {
      toast.success("Item atualizado com sucesso!");
      fetchInventory();
    }
  };

  const deleteInventoryItem = async (id: number) => {
    const { error } = await supabase.from("inventory_items").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover item.");
      console.error(error);
    } else {
      toast.success("Item removido com sucesso!");
      fetchInventory();
    }
  };
  
  return {
    inventoryItems,
    isLoading,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    fetchInventory,
  };
}