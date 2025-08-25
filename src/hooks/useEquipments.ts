import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Equipment {
  id: number;
  name: string;
  model: string;
  sector: string;
  responsible: string;
  status: "Em Dia" | "Com Aviso" | "Atrasado";
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceInterval: number;
}

export interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  date: string;
  responsible: string;
  description: string;
  type: "Preventiva" | "Corretiva";
}

// Mock data inicial
const initialEquipments: Equipment[] = [
  {
    id: 1,
    name: "Impressora HP LaserJet Pro",
    model: "M404dn",
    sector: "Administração",
    responsible: "Maria Silva",
    status: "Em Dia",
    lastMaintenance: "2024-08-20",
    nextMaintenance: "2024-09-20",
    maintenanceInterval: 30
  },
  {
    id: 2,
    name: "Notebook Dell Inspiron",
    model: "15 3000",
    sector: "TI",
    responsible: "João Santos",
    status: "Com Aviso",
    lastMaintenance: "2024-08-15",
    nextMaintenance: "2024-08-25",
    maintenanceInterval: 10
  },
  {
    id: 3,
    name: "Projetor Epson",
    model: "PowerLite X41+",
    sector: "Sala de Reunião",
    responsible: "Ana Costa",
    status: "Atrasado",
    lastMaintenance: "2024-07-30",
    nextMaintenance: "2024-08-15",
    maintenanceInterval: 15
  },
  {
    id: 4,
    name: "Scanner Canon",
    model: "CanoScan LiDE 400",
    sector: "Recepção",
    responsible: "Carlos Lima",
    status: "Em Dia",
    lastMaintenance: "2024-08-18",
    nextMaintenance: "2024-09-18",
    maintenanceInterval: 30
  }
];

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [isLoading, setIsLoading] = useState(false);

  const addEquipment = (equipment: Omit<Equipment, "id">) => {
    const newEquipment = {
      ...equipment,
      id: Math.max(...equipments.map(e => e.id)) + 1
    };
    setEquipments(prev => [...prev, newEquipment]);
    toast.success("Equipamento adicionado com sucesso!");
  };

  const updateEquipment = (id: number, updates: Partial<Equipment>) => {
    setEquipments(prev => 
      prev.map(equipment => 
        equipment.id === id ? { ...equipment, ...updates } : equipment
      )
    );
    toast.success("Equipamento atualizado com sucesso!");
  };

  const deleteEquipment = (id: number) => {
    setEquipments(prev => prev.filter(equipment => equipment.id !== id));
    toast.success("Equipamento removido com sucesso!");
  };

  const registerMaintenance = (equipmentId: number, maintenanceData: Omit<MaintenanceRecord, "id" | "equipmentId">) => {
    const equipment = equipments.find(e => e.id === equipmentId);
    if (!equipment) return;

    // Atualiza as datas de manutenção
    const today = new Date().toISOString().split('T')[0];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + equipment.maintenanceInterval);
    
    updateEquipment(equipmentId, {
      lastMaintenance: today,
      nextMaintenance: nextDate.toISOString().split('T')[0],
      status: "Em Dia"
    });

    toast.success("Manutenção registrada com sucesso!");
  };

  return {
    equipments,
    isLoading,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    registerMaintenance
  };
}