import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { parseISO, addDays, format } from "date-fns";

// Tipos para a tabela 'equipments'
export type Equipment = Tables<'equipments'>;
export type NewEquipment = TablesInsert<'equipments'>;
export type UpdatedEquipment = TablesUpdate<'equipments'>;

// Tipos para a tabela 'maintenance_records'
export type MaintenanceRecord = Tables<'maintenance_records'>;
export type NewMaintenanceRecord = TablesInsert<'maintenance_records'>;

// Tipos para as novas tabelas
export type Sector = Tables<'sectors'>;
export type Responsible = Tables<'responsibles'>;

// Lógica para calcular o status do equipamento
const getEquipmentStatus = (nextMaintenance: string | null): "Em Dia" | "Com Aviso" | "Atrasado" => {
  if (!nextMaintenance) return "Em Dia";

  const today = new Date();
  const nextDate = parseISO(nextMaintenance);
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Atrasado";
  }
  if (diffDays <= 7) {
    return "Com Aviso";
  }
  return "Em Dia";
};

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectors, setSectors] = useState<string[]>([]);
  const [responsibles, setResponsibles] = useState<string[]>([]);

  const fetchLists = async () => {
    // Buscar setores
    const { data: sectorsData, error: sectorsError } = await supabase
      .from("sectors")
      .select("name");
    if (sectorsError) {
      console.error("Erro ao buscar setores:", sectorsError);
    } else {
      setSectors(sectorsData.map(s => s.name));
    }

    // Buscar responsáveis
    const { data: responsiblesData, error: responsiblesError } = await supabase
      .from("responsibles")
      .select("name");
    if (responsiblesError) {
      console.error("Erro ao buscar responsáveis:", responsiblesError);
    } else {
      setResponsibles(responsiblesData.map(r => r.name));
    }
  };

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
    fetchLists();
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
    
    // Cria a data de forma robusta e segura
    const lastMaintenanceDate = parseISO(maintenanceData.date);
    const nextMaintenanceDate = addDays(lastMaintenanceDate, equipment.maintenance_interval || 30);

    const updates = {
      last_maintenance: format(lastMaintenanceDate, 'yyyy-MM-dd'),
      next_maintenance: format(nextMaintenanceDate, 'yyyy-MM-dd'),
    }

    const { error: updateError } = await supabase.from("equipments").update({
      ...updates,
      status: getEquipmentStatus(updates.next_maintenance)
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
    sectors,
    responsibles,
  };
}