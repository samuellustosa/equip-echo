import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Filter, MoreHorizontal, Wrench, History, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEquipments, Equipment, NewEquipment } from "@/hooks/useEquipments";
import { AddEquipmentDialog } from "@/components/equipments/add-equipment-dialog";
import { MaintenanceDialog } from "@/components/equipments/maintenance-dialog";
import { EditEquipmentDialog } from "@/components/equipments/edit-equipment-dialog";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { MaintenanceHistoryDialog } from "@/components/equipments/maintenance-history-dialog";
import { cn } from "@/lib/utils";

export default function Equipments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  
  const { equipments, addEquipment, registerMaintenance, updateEquipment, deleteEquipment, isLoading } = useEquipments();

  const filteredEquipments = equipments.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Em Dia":
        return <StatusBadge status="success">{status}</StatusBadge>;
      case "Com Aviso":
        return <StatusBadge status="warning">{status}</StatusBadge>;
      case "Atrasado":
        return <StatusBadge status="danger">{status}</StatusBadge>;
      default:
        return <StatusBadge status="neutral">{status}</StatusBadge>;
    }
  };

  const getDaysUntilMaintenance = (nextMaintenance: string | null) => {
    if (!nextMaintenance) return { text: "N/A", className: "text-muted-foreground" };
    
    // Converte ambas as datas para o fuso horário local no início do dia para uma comparação precisa
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDate = new Date(nextMaintenance + 'T00:00:00');
    
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `Atrasado em ${Math.abs(diffDays)}d`, className: "text-destructive font-medium" };
    } else if (diffDays <= 7) {
      // Alteração aqui: usando a cor warning em vez de orange-500
      return { text: `${diffDays} dias`, className: "text-warning font-medium" };
    } else {
      return { text: `${diffDays} dias`, className: "text-success font-medium" };
    }
  };

  const handleDelete = () => {
    if (selectedEquipment) {
      deleteEquipment(selectedEquipment.id);
      setSelectedEquipment(null);
      setShowDeleteDialog(false);
    }
  };

  const formatMaintenanceDate = (date: string | null) => {
    if (!date) return '-';
    // Adiciona a hora T00:00:00 para garantir que a data seja interpretada como fuso horário local
    const formattedDate = new Date(date + 'T00:00:00');
    return formattedDate.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Equipamentos</h1>
          <p className="text-muted-foreground">Gerenciar equipamentos e suas manutenções</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:shadow-elegant transition-all"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar equipamentos..."
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

      {/* Equipment Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
          <CardDescription>
            {filteredEquipments.length} equipamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Manutenção</TableHead>
                  <TableHead>Próxima Manutenção</TableHead>
                  <TableHead>Dias Restantes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : (
                  filteredEquipments.map((equipment, index) => {
                    const { text, className: daysClassName } = getDaysUntilMaintenance(equipment.next_maintenance);
                    const rowClassName = index % 2 === 1 ? 'bg-muted/50' : '';
                    return (
                      <TableRow key={equipment.id} className={cn(rowClassName, "hover:bg-muted/50")}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{equipment.name}</p>
                            <p className="text-sm text-muted-foreground">{equipment.model}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{equipment.sector}</Badge>
                        </TableCell>
                        <TableCell>{equipment.responsible}</TableCell>
                        <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                        <TableCell className="text-sm">{formatMaintenanceDate(equipment.last_maintenance)}</TableCell>
                        <TableCell className="text-sm">{formatMaintenanceDate(equipment.next_maintenance)}</TableCell>
                        <TableCell>
                          <span className={daysClassName}>
                            {text}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border z-50">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEquipment(equipment);
                                  setShowMaintenanceDialog(true);
                                }}
                              >
                                <Wrench className="h-4 w-4 mr-2" />
                                Registrar Manutenção
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEquipment(equipment);
                                  setShowHistoryDialog(true);
                                }}
                              >
                                <History className="h-4 w-4 mr-2" />
                                Ver Histórico
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEquipment(equipment);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEquipment(equipment);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEquipmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={addEquipment}
      />

      <MaintenanceDialog
        open={showMaintenanceDialog}
        onOpenChange={setShowMaintenanceDialog}
        equipment={selectedEquipment}
        onSubmit={registerMaintenance}
      />
      
      <EditEquipmentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        equipment={selectedEquipment}
        onSubmit={updateEquipment}
      />
      
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Tem certeza que deseja excluir?"
        description="Esta ação não pode ser desfeita. O equipamento e todos os registros de manutenção associados serão permanentemente excluídos."
      />

      <MaintenanceHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        equipmentId={selectedEquipment?.id || null}
        equipmentName={selectedEquipment?.name || null}
      />
    </div>
  );
}