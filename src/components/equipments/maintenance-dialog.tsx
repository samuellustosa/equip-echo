import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Equipment } from "@/hooks/useEquipments";

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onSubmit: (equipmentId: number, data: { date: string; responsible: string; description: string; type: "Preventiva" | "Corretiva" }) => void;
}

export function MaintenanceDialog({ open, onOpenChange, equipment, onSubmit }: MaintenanceDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    responsible: "",
    description: "",
    type: "Preventiva" as "Preventiva" | "Corretiva"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) return;

    onSubmit(equipment.id, formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      responsible: "",
      description: "",
      type: "Preventiva"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Manutenção</DialogTitle>
          <DialogDescription>
            {equipment ? `Equipamento: ${equipment.name}` : "Registrar nova manutenção"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data da Manutenção</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              value={formData.responsible}
              onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
              placeholder="Nome do técnico responsável"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Manutenção</Label>
            <Select onValueChange={(value: "Preventiva" | "Corretiva") => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preventiva">Preventiva</SelectItem>
                <SelectItem value="Corretiva">Corretiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva os procedimentos realizados..."
              rows={3}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}