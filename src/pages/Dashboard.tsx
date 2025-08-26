import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEquipments } from "@/hooks/useEquipments";
import { useInventory } from "@/hooks/useInventory";
import { Wrench, Package, AlertTriangle, CalendarDays } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { equipments, isLoading: isLoadingEquipments } = useEquipments();
  const { inventoryItems, isLoading: isLoadingInventory } = useInventory();

  const equipmentsNeedingMaintenance = equipments.filter(
    (e) => new Date(e.next_maintenance || "") < new Date()
  );
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.minimum
  );

  const maintenanceData = [
    { name: "Atrasado", count: equipmentsNeedingMaintenance.length },
    { name: "Em Dia", count: equipments.length - equipmentsNeedingMaintenance.length },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingEquipments ? "..." : equipments.length}
            </div>
            <p className="text-xs text-muted-foreground">Em monitoramento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingInventory ? "..." : inventoryItems.length}
            </div>
            <p className="text-xs text-muted-foreground">Itens únicos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção Atrasada</CardTitle>
            <CalendarDays className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {isLoadingEquipments ? "..." : equipmentsNeedingMaintenance.length}
            </div>
            <p className="text-xs text-muted-foreground">Equipamentos precisam de atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {isLoadingInventory ? "..." : lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">Itens a serem repostos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status da Manutenção</CardTitle>
          <CardDescription>Resumo dos equipamentos por status de manutenção.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}