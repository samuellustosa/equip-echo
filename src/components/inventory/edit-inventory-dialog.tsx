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
import { InventoryItem, UpdatedInventoryItem } from "@/hooks/useInventory";

interface EditInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSubmit: (id: number, updates: UpdatedInventoryItem) => void;
}

export function EditInventoryDialog({ open, onOpenChange, item, onSubmit }: EditInventoryDialogProps) {
  const [formData, setFormData] = useState<UpdatedInventoryItem>({
    name: "",
    category: "",
    quantity: 0,
    minimum: 5,
    unit: "",
    location: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        minimum: item.minimum,
        unit: item.unit,
        location: item.location,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    onSubmit(item.id, formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Item do Estoque</DialogTitle>
          <DialogDescription>
            Atualize os dados do item selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Toner HP 85A"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} value={formData.category || ""}>
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
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))} value={formData.unit || ""}>
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
              value={formData.location || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Almoxarifado A1"
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