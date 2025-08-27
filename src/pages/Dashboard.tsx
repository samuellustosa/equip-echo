
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wrench, Package, TrendingUp, Calendar } from "lucide-react";
import { useEquipments } from "@/hooks/useEquipments";
import { useInventory } from "@/hooks/useInventory";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const { equipments, isLoading: equipmentsLoading } = useEquipments();
  const { inventoryItems, isLoading: inventoryLoading } = useInventory();

  if (equipmentsLoading || inventoryLoading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minimum);
  const overdueEquipments = equipments.filter(eq => eq.status === "Atrasado");
  const warningEquipments = equipments.filter(eq => eq.status === "Com Aviso");
  
  // Dados para gráficos
  const equipmentsByStatus = [
    { name: 'Em Dia', value: equipments.filter(eq => eq.status === "Em Dia").length, color: '#10b981' },
    { name: 'Com Aviso', value: warningEquipments.length, color: '#f59e0b' },
    { name: 'Atrasado', value: overdueEquipments.length, color: '#ef4444' },
  ];

  const inventoryByStatus = [
    { name: 'Disponível', value: inventoryItems.filter(item => item.status === "Disponível").length },
    { name: 'Em Uso', value: inventoryItems.filter(item => item.status === "Em Uso").length },
    { name: 'Indisponível', value: inventoryItems.filter(item => item.status === "Indisponível").length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento
        </p>
      </div>

      {/* Alertas */}
      {(overdueEquipments.length > 0 || lowStockItems.length > 0) && (
        <div className="space-y-3">
          {overdueEquipments.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{overdueEquipments.length} equipamento(s)</strong> com manutenção atrasada: {' '}
                {overdueEquipments.map(eq => eq.name).join(', ')}
              </AlertDescription>
            </Alert>
          )}
          {lowStockItems.length > 0 && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                <strong>{lowStockItems.length} item(s)</strong> com estoque baixo: {' '}
                {lowStockItems.map(item => item.name).join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipamentos</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipments.length}</div>
            <p className="text-xs text-muted-foreground">
              {equipments.filter(eq => eq.status === "Em Dia").length} em dia
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens de Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryItems.filter(item => item.status === "Disponível").length} disponíveis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueEquipments.length}</div>
            <p className="text-xs text-muted-foreground">
              {warningEquipments.length} com aviso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Itens abaixo do mínimo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Equipamentos</CardTitle>
            <CardDescription>Distribuição por status de manutenção</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={equipmentsByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {equipmentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Inventário</CardTitle>
            <CardDescription>Itens por status de disponibilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Equipamentos que precisam de atenção */}
      {(overdueEquipments.length > 0 || warningEquipments.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos que Precisam de Atenção</CardTitle>
            <CardDescription>Manutenções atrasadas e com aviso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueEquipments.map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{equipment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Setor: {equipment.sector} | Responsável: {equipment.responsible}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Atrasado
                  </Badge>
                </div>
              ))}
              {warningEquipments.map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{equipment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Setor: {equipment.sector} | Responsável: {equipment.responsible}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Com Aviso
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
