import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Filter, MoreHorizontal, Package, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useInventory, InventoryItem, NewInventoryItem } from "@/hooks/useInventory";
import { AddInventoryDialog } from "@/components/inventory/add-inventory-dialog";
import { EditInventoryDialog } from "@/components/inventory/edit-inventory-dialog";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { toast } from "sonner";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const { inventoryItems, isLoading, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();

  // Check for low stock items on load
  useEffect(() => {
    const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minimum);
    if (lowStockItems.length > 0) {
      toast.warning(`${lowStockItems.length} item(ns) com estoque baixo!`, {
        description: lowStockItems.map(item => item.name).join(", ")
      });
    }
  }, [inventoryItems]);

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number, minimum: number) => {
    if (quantity === 0) return { status: "danger" as const, label: "Sem Estoque" };
    if (quantity <= minimum) return { status: "warning" as const, label: "Estoque Baixo" };
    return { status: "success" as const, label: "Normal" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponível":
        return <StatusBadge status="success">{status}</StatusBadge>;
      case "EM MANUTENÇÃO":
        return <StatusBadge status="warning">{status}</StatusBadge>;
      case "DEFEITUOSO":
        return <StatusBadge status="danger">{status}</StatusBadge>;
      default:
        return <StatusBadge status="neutral">{status}</StatusBadge>;
    }
  };

  const lowStockCount = inventoryItems.filter(item => item.quantity <= item.minimum).length;

  const handleDelete = () => {
    if (selectedItem) {
      deleteInventoryItem(selectedItem.id);
      setSelectedItem(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground">Gerenciar itens e controle de estoque</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Categorias
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-primary hover:shadow-elegant transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Alert for low stock */}
      {lowStockCount > 0 && (
        <Card className="border-warning bg-warning-light shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <p className="text-sm font-medium">
                <span className="text-warning">{lowStockCount} item(s)</span> com estoque baixo ou zerado
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar itens do estoque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Itens do Estoque</CardTitle>
          <CardDescription>
            {filteredItems.length} item(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Carregando...</p>
            </div>
          ) : filteredItems.length === 0 && !searchTerm ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum item cadastrado</p>
              <p className="text-sm text-muted-foreground">
                Adicione o primeiro item ao seu inventário
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Item</th>
                    <th className="text-left font-medium p-2">Categoria</th>
                    <th className="text-left font-medium p-2">Quantidade</th>
                    <th className="text-left font-medium p-2">Localização</th>
                    <th className="text-left font-medium p-2">Status</th>
                    <th className="text-left font-medium p-2">Última Movimentação</th>
                    <th className="text-left font-medium p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item.quantity, item.minimum);
                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Min: {item.minimum} {item.unit}
                            </p>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity} {item.unit}</span>
                            <StatusBadge status={stockStatus.status}>
                              {stockStatus.label}
                            </StatusBadge>
                          </div>
                        </td>
                        <td className="p-2">{item.location || '-'}</td>
                        <td className="p-2">{getStatusBadge(item.status)}</td>
                        <td className="p-2 text-sm">{item.last_movement || '-'}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddInventoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={addInventoryItem}
      />
      
      <EditInventoryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={selectedItem}
        onSubmit={updateInventoryItem}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Tem certeza que deseja excluir?"
        description="Esta ação não pode ser desfeita. O item será permanentemente removido do estoque."
      />
    </div>
  );
}