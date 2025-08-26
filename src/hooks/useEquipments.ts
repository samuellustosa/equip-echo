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

// Lógica para calcular o status do equipamento
const getEquipmentStatus = (nextMaintenance: string | null): "Em Dia" | "Com Aviso" | "Atrasado" => {
  if (!nextMaintenance) return "Em Dia";

  const today = new Date();
  const nextDate = new Date(nextMaintenance);
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Atrasado";
  }
  if (diffDays <= 7) { // Define 7 dias como o período de aviso
    return "Com Aviso";
  }
  return "Em Dia";
};

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
      const equipmentsWithStatus = data.map(eq => ({
        ...eq,
        status: getEquipmentStatus(eq.next_maintenance)
      }));
      setEquipments(equipmentsWithStatus as Equipment[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const addEquipment = async (equipment: NewEquipment) => {
    const newEquipmentData = {
      ...equipment,
      status: "Em Dia",
    };
    const { error } = await supabase.from("equipments").insert(newEquipmentData);
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
    
    // Cria a data de forma robusta para evitar problemas de fuso horário
    const lastMaintenanceDate = new Date(`${maintenanceData.date}T00:00:00`);
    const nextMaintenance = new Date(lastMaintenanceDate);
    nextMaintenance.setDate(lastMaintenanceDate.getDate() + (equipment.maintenance_interval || 30));

    const { data: updatedEquipmentData, error: updateError } = await supabase.from("equipments").update({
      last_maintenance: maintenanceData.date,
      next_maintenance: nextMaintenance.toISOString().split('T')[0],
      status: getEquipmentStatus(nextMaintenance.toISOString().split('T')[0])
    }).eq("id", equipmentId).select();
    
    if (updateError) {
      toast.error("Erro ao atualizar equipamento.");
      console.error(updateError);
    } else {
      toast.success("Manutenção registrada com sucesso!");
      if (updatedEquipmentData && updatedEquipmentData.length > 0) {
        setEquipments(prevEquipments =>
          prevEquipments.map(eq =>
            eq.id === equipmentId ? { ...eq, ...updatedEquipmentData[0] } : eq
          )
        );
      } else {
        fetchEquipments(); // Fallback para recarregar se a resposta estiver vazia
      }
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