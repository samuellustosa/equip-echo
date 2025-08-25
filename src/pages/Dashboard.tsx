import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Package, Wrench, AlertTriangle, CheckCircle } from "lucide-react";

const stats = [
  {
    title: "Total de Equipamentos",
    value: "24",
    description: "3 precisam de manutenção",
    icon: Wrench,
    status: "neutral" as const
  },
  {
    title: "Itens em Estoque",
    value: "156",
    description: "8 com estoque baixo",
    icon: Package,
    status: "warning" as const
  },
  {
    title: "Equipamentos em Dia",
    value: "21",
    description: "87.5% em funcionamento",
    icon: CheckCircle,
    status: "success" as const
  },
  {
    title: "Alertas Ativos",
    value: "5",
    description: "Requer atenção imediata",
    icon: AlertTriangle,
    status: "danger" as const
  }
];

const recentEquipments = [
  { name: "Impressora HP LaserJet", sector: "Administração", status: "Em Dia", lastMaintenance: "2024-08-20" },
  { name: "Notebook Dell Inspiron", sector: "TI", status: "Com Aviso", lastMaintenance: "2024-08-15" },
  { name: "Projetor Epson", sector: "Sala de Reunião", status: "Atrasado", lastMaintenance: "2024-07-30" },
];

const lowStockItems = [
  { name: "Toner HP 85A", quantity: 2, minimum: 5, category: "TONERS" },
  { name: "Cabo HDMI 2m", quantity: 1, minimum: 3, category: "CABOS" },
  { name: "Mouse Óptico", quantity: 0, minimum: 2, category: "PERIFÉRICOS" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do gerenciamento de recursos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Equipment Maintenance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Equipamentos Recentes</CardTitle>
            <CardDescription>Últimas manutenções realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEquipments.map((equipment) => (
                <div key={equipment.name} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground">{equipment.sector}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusBadge 
                      status={
                        equipment.status === "Em Dia" ? "success" : 
                        equipment.status === "Com Aviso" ? "warning" : "danger"
                      }
                    >
                      {equipment.status}
                    </StatusBadge>
                    <p className="text-xs text-muted-foreground">{equipment.lastMaintenance}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Estoque Baixo</CardTitle>
            <CardDescription>Itens que precisam de reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusBadge status={item.quantity === 0 ? "danger" : "warning"}>
                      {item.quantity}/{item.minimum}
                    </StatusBadge>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity === 0 ? "Sem estoque" : "Baixo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}