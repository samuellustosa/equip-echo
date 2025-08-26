import { useEffect, useState } from "react";
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
import { Equipment, UpdatedEquipment } from "@/hooks/useEquipments";

interface EditEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onSubmit: (id: number, updates: UpdatedEquipment) => void;
}

export function EditEquipmentDialog({ open, onOpenChange, equipment, onSubmit }: EditEquipmentDialogProps) {
  const [formData, setFormData] = useState<UpdatedEquipment>({
    name: "",
    model: "",
    sector: "",
    responsible: "",
    maintenance_interval: 30
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        model: equipment.model,
        sector: equipment.sector,
        responsible: equipment.responsible,
        maintenance_interval: equipment.maintenance_interval
      });
    }
  }, [equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) return;
    
    onSubmit(equipment.id, formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Equipamento</DialogTitle>
          <DialogDescription>
            Atualize os dados do equipamento selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Equipamento</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Impressora HP LaserJet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={formData.model || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Ex: M404dn"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))} value={formData.sector || ""}>
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
              value={formData.responsible || ""}
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
              value={formData.maintenance_interval || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, maintenance_interval: parseInt(e.target.value) }))}
              placeholder="30"
              min="1"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}