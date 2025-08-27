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
import { Equipment, NewMaintenanceRecord, useEquipments } from "@/hooks/useEquipments";
import { Textarea } from "@/components/ui/textarea";

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onSubmit: (data: { date: string; responsible: string; description: string | null; type: string }) => Promise<void>;
  responsibles: string[];
}

export function MaintenanceDialog({ open, onOpenChange, equipment, onSubmit, responsibles }: MaintenanceDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split('T')[0],
    responsible: "",
    description: "",
    type: "Preventiva"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split('T')[0],
        responsible: "",
        description: "",
        type: "Preventiva"
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
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
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, responsible: value }))} value={formData.responsible}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {responsibles.map((responsible) => (
                  <SelectItem key={responsible} value={responsible}>{responsible}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Manutenção</Label>
            <Select onValueChange={(value: "Preventiva" | "Corretiva") => setFormData(prev => ({ ...prev, type: value }))} value={formData.type}>
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
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}