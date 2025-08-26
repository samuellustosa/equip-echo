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
import { NewInventoryItem } from "@/hooks/useInventory";

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: NewInventoryItem) => void;
}

export function AddInventoryDialog({ open, onOpenChange, onSubmit }: AddInventoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    minimum: 5,
    unit: "",
    location: "",
    status: "Disponível"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];

    const newItem: NewInventoryItem = {
      ...formData,
      last_movement: today
    };

    onSubmit(newItem);
    setFormData({
      name: "",
      category: "",
      quantity: 0,
      minimum: 5,
      unit: "",
      location: "",
      status: "Disponível"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo item.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Toner HP 85A"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERIFÉRICOS">PERIFÉRICOS</SelectItem>
                <SelectItem value="TONERS">TONERS</SelectItem>
                <SelectItem value="CABOS">CABOS</SelectItem>
                <SelectItem value="PAPEL">PAPEL</SelectItem>
                <SelectItem value="LIMPEZA">LIMPEZA</SelectItem>
                <SelectItem value="ESCRITÓRIO">ESCRITÓRIO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimum">Mínimo</Label>
              <Input
                id="minimum"
                type="number"
                value={formData.minimum}
                onChange={(e) => setFormData(prev => ({ ...prev, minimum: parseInt(e.target.value) || 5 }))}
                placeholder="5"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unidade</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UN">Unidade</SelectItem>
                <SelectItem value="CX">Caixa</SelectItem>
                <SelectItem value="PCT">Pacote</SelectItem>
                <SelectItem value="L">Litro</SelectItem>
                <SelectItem value="KG">Quilograma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Almoxarifado A1"
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