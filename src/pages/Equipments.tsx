
import { useState } from "react";
import { Plus, Edit, Trash2, Wrench, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddEquipmentDialog } from "@/components/equipments/add-equipment-dialog";
import { EditEquipmentDialog } from "@/components/equipments/edit-equipment-dialog";
import { MaintenanceDialog } from "@/components/equipments/maintenance-dialog";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useEquipments, Equipment } from "@/hooks/useEquipments";

export default function Equipments() {
  const { equipments, isLoading, addEquipment, updateEquipment, deleteEquipment, registerMaintenance, sectors, responsibles } = useEquipments();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Dia":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Com Aviso":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Atrasado":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowEditDialog(true);
  };

  const handleMaintenance = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowMaintenanceDialog(true);
  };

  const handleDelete = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedEquipment) {
      deleteEquipment(selectedEquipment.id);
      setSelectedEquipment(null);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus equipamentos e manutenções
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Equipamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Aviso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {equipments.filter(eq => eq.status === "Com Aviso").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {equipments.filter(eq => eq.status === "Atrasado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os equipamentos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Próxima Manutenção</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipments.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell className="font-medium">{equipment.name}</TableCell>
                  <TableCell>{equipment.model || "-"}</TableCell>
                  <TableCell>{equipment.responsible}</TableCell>
                  <TableCell>{equipment.sector}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(equipment.status)}>
                      {equipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {equipment.next_maintenance 
                      ? new Date(equipment.next_maintenance).toLocaleDateString('pt-BR')
                      : "-"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(equipment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMaintenance(equipment)}
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(equipment)}
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

      <AddEquipmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={addEquipment}
        sectors={sectors}
        responsibles={responsibles}
      />

      {selectedEquipment && (
        <>
          <EditEquipmentDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            equipment={selectedEquipment}
            onSubmit={updateEquipment}
            sectors={sectors}
            responsibles={responsibles}
          />
          <MaintenanceDialog
            open={showMaintenanceDialog}
            onOpenChange={setShowMaintenanceDialog}
            equipment={selectedEquipment}
            onSubmit={(maintenanceData) => registerMaintenance(selectedEquipment.id, maintenanceData)}
            responsibles={responsibles}
          />
        </>
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Excluir Equipamento"
        description="Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
