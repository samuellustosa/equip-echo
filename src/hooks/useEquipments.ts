import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Tipos para a tabela 'equipments'
export type Equipment = Database['public']['Tables']['equipments']['Row'];
export type NewEquipment = Database['public']['Tables']['equipments']['Insert'];
export type UpdatedEquipment = Database['public']['Tables']['equipments']['Update'];

// Tipos para a tabela 'maintenance_records'
export type MaintenanceRecord = Database['public']['Tables']['maintenance_records']['Row'];
export type NewMaintenanceRecord = Database['public']['Tables']['maintenance_records']['Insert'];

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEquipments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("equipments")
      .select("*")
      .order("id");

    if (error) {
      toast.error("Erro ao buscar equipamentos.");
      console.error(error);
    } else {
      setEquipments(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const addEquipment = async (equipment: NewEquipment) => {
    const { error } = await supabase.from("equipments").insert(equipment);
    if (error) {
      toast.error("Erro ao adicionar equipamento.");
      console.error(error);
    } else {
      toast.success("Equipamento adicionado com sucesso!");
      fetchEquipments();
    }
  };

  const updateEquipment = async (id: number, updates: UpdatedEquipment) => {
    const { error } = await supabase.from("equipments").update(updates).eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar equipamento.");
      console.error(error);
    } else {
      toast.success("Equipamento atualizado com sucesso!");
      fetchEquipments();
    }
  };

  const deleteEquipment = async (id: number) => {
    const { error } = await supabase.from("equipments").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover equipamento.");
      console.error(error);
    } else {
      toast.success("Equipamento removido com sucesso!");
      fetchEquipments();
    }
  };

  const registerMaintenance = async (equipmentId: number, maintenanceData: { date: string; responsible: string; description: string | null; type: string }) => {
    const newMaintenanceRecord: NewMaintenanceRecord = {
      ...maintenanceData,
      equipment_id: equipmentId
    };

    const { error: maintenanceError } = await supabase.from("maintenance_records").insert(newMaintenanceRecord);

    if (maintenanceError) {
      toast.error("Erro ao registrar manutenção.");
      console.error(maintenanceError);
      return;
    }

    const equipment = equipments.find(e => e.id === equipmentId);
    if (!equipment) return;
    
    const today = new Date().toISOString().split('T')[0];
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + equipment.maintenance_interval);

    const { error: updateError } = await supabase.from("equipments").update({
      last_maintenance: today,
      next_maintenance: nextDate.toISOString().split('T')[0],
      status: "Em Dia"
    }).eq("id", equipmentId);
    
    if (updateError) {
      toast.error("Erro ao atualizar equipamento.");
      console.error(updateError);
    } else {
      toast.success("Manutenção registrada com sucesso!");
      fetchEquipments();
    }
  };

  return {
    equipments,
    isLoading,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    registerMaintenance,
    fetchEquipments,
  };
}