import { useState, useMemo } from "react";
import { Equipment } from "./useEquipments";
import { InventoryItem } from "./useInventory";

export function useSearch(equipments: Equipment[], inventoryItems: InventoryItem[]) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredEquipments = useMemo(() => {
    if (!searchTerm) return equipments;
    return equipments.filter(equipment =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipment.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [equipments, searchTerm]);

  const filteredInventoryItems = useMemo(() => {
    if (!searchTerm) return inventoryItems;
    return inventoryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryItems, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEquipments,
    filteredInventoryItems,
  };
}