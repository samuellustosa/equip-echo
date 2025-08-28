import { useState } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddInventoryDialog } from "@/components/inventory/add-inventory-dialog";
import { EditInventoryDialog } from "@/components/inventory/edit-inventory-dialog";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import { useSearch } from "@/hooks/useSearch"; // Novo import

export default function Inventory() {
  const { inventoryItems, isLoading, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();
  const { searchTerm } = useSearch(); // Usar o termo de busca global

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minimum);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Em Uso":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Indisponível":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditDialog(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteInventoryItem(selectedItem.id);
      setSelectedItem(null);
      setShowDeleteDialog(false);
    }
  };

  // Lógica de filtragem
  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">
            Controle seu inventário e materiais
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{lowStockItems.length} item(s)</strong> com estoque baixo: {' '}
            {lowStockItems.map(item => item.name).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventoryItems.filter(item => item.status === "Disponível").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inventoryItems.filter(item => item.status === "Em Uso").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {lowStockItems.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Itens</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os itens do estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <span className={item.quantity <= item.minimum ? "text-red-600 font-semibold" : ""}>
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{item.minimum}</TableCell>
                  <TableCell>{item.unit || "-"}</TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddInventoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={addInventoryItem}
      />

      {selectedItem && (
        <EditInventoryDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          item={selectedItem}
          onSubmit={updateInventoryItem}
        />
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Excluir Item"
        description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      />
    </div>
  );
}