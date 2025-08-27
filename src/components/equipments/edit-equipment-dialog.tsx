
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Equipment, UpdatedEquipment } from "@/hooks/useEquipments";

interface EditEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment;
  onSubmit: (id: number, updates: UpdatedEquipment) => void;
  sectors: string[];
  responsibles: string[];
}

export function EditEquipmentDialog({ 
  open, 
  onOpenChange, 
  equipment, 
  onSubmit,
  sectors,
  responsibles 
}: EditEquipmentDialogProps) {
  const [formData, setFormData] = useState({
    name: equipment.name,
    model: equipment.model || "",
    responsible: equipment.responsible,
    sector: equipment.sector,
    maintenance_interval: equipment.maintenance_interval.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(equipment.id, {
      name: formData.name,
      model: formData.model || null,
      responsible: formData.responsible,
      sector: formData.sector,
      maintenance_interval: parseInt(formData.maintenance_interval),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Equipamento</DialogTitle>
          <DialogDescription>
            Edite as informações do equipamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Select value={formData.responsible} onValueChange={(value) => setFormData({ ...formData, responsible: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {responsibles.map((responsible) => (
                  <SelectItem key={responsible} value={responsible}>
                    {responsible}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sector">Setor</Label>
            <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maintenance_interval">Intervalo de Manutenção (dias)</Label>
            <Input
              id="maintenance_interval"
              type="number"
              value={formData.maintenance_interval}
              onChange={(e) => setFormData({ ...formData, maintenance_interval: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Atualizar Equipamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
