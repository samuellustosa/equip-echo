import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewEquipment } from "@/hooks/useEquipments";

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (equipment: NewEquipment) => void;
}

export function AddEquipmentDialog({ open, onOpenChange, onSubmit }: AddEquipmentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    sector: "",
    responsible: "",
    maintenance_interval: 30,
    last_maintenance: new Date().toISOString().split('T')[0] // Adicionado estado para a data de última manutenção
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lastMaintenanceDate = new Date(formData.last_maintenance);
    const nextMaintenance = new Date(lastMaintenanceDate);
    nextMaintenance.setDate(lastMaintenanceDate.getDate() + formData.maintenance_interval);

    const newEquipment: NewEquipment = {
      name: formData.name,
      model: formData.model,
      sector: formData.sector,
      responsible: formData.responsible,
      maintenance_interval: formData.maintenance_interval,
      status: "Em Dia",
      last_maintenance: formData.last_maintenance,
      next_maintenance: nextMaintenance.toISOString().split('T')[0]
    };

    onSubmit(newEquipment);
    setFormData({
      name: "",
      model: "",
      sector: "",
      responsible: "",
      maintenance_interval: 30,
      last_maintenance: new Date().toISOString().split('T')[0] // Resetar para a data atual
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Equipamento</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo equipamento.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Equipamento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Impressora HP LaserJet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Ex: M404dn"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administração">Administração</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Recepção">Recepção</SelectItem>
                <SelectItem value="Sala de Reunião">Sala de Reunião</SelectItem>
                <SelectItem value="Almoxarifado">Almoxarifado</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              value={formData.responsible}
              onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
              placeholder="Ex: João Silva"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interval">Intervalo de Manutenção (dias)</Label>
            <Input
              id="interval"
              type="number"
              value={formData.maintenance_interval}
              onChange={(e) => setFormData(prev => ({ ...prev, maintenance_interval: parseInt(e.target.value) }))}
              placeholder="30"
              min="1"
              required
            />
          </div>

          {/* Novo campo para a data da última manutenção */}
          <div className="space-y-2">
            <Label htmlFor="last_maintenance">Data da Última Manutenção</Label>
            <Input
              id="last_maintenance"
              type="date"
              value={formData.last_maintenance}
              onChange={(e) => setFormData(prev => ({ ...prev, last_maintenance: e.target.value }))}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}