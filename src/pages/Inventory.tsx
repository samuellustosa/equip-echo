import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Filter, MoreHorizontal, Package, History, AlertTriangle } from "lucide-react";
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

// Mock data para demonstração
const inventoryItems = [
  {
    id: 1,
    name: "Toner HP 85A",
    category: "TONERS",
    quantity: 2,
    minimum: 5,
    unit: "unidade",
    location: "Almoxarifado A",
    status: "ATIVO",
    lastMovement: "2024-08-15"
  },
  {
    id: 2,
    name: "Cabo HDMI 2m",
    category: "CABOS",
    quantity: 1,
    minimum: 3,
    unit: "unidade",
    location: "Almoxarifado B",
    status: "ATIVO",
    lastMovement: "2024-08-10"
  },
  {
    id: 3,
    name: "Mouse Óptico",
    category: "PERIFÉRICOS",
    quantity: 0,
    minimum: 2,
    unit: "unidade",
    location: "Almoxarifado A",
    status: "ATIVO",
    lastMovement: "2024-08-05"
  },
  {
    id: 4,
    name: "Gabinete ATX",
    category: "GABINETES",
    quantity: 5,
    minimum: 2,
    unit: "unidade",
    location: "Almoxarifado C",
    status: "ATIVO",
    lastMovement: "2024-08-20"
  },
  {
    id: 5,
    name: "Fonte 500W",
    category: "FONTES",
    quantity: 1,
    minimum: 3,
    unit: "unidade",
    location: "Almoxarifado C",
    status: "EM MANUTENÇÃO",
    lastMovement: "2024-08-12"
  }
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number, minimum: number) => {
    if (quantity === 0) return { status: "danger" as const, label: "Sem Estoque" };
    if (quantity <= minimum) return { status: "warning" as const, label: "Estoque Baixo" };
    return { status: "success" as const, label: "Normal" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATIVO":
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
          <Button className="bg-gradient-primary hover:shadow-elegant transition-all">
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Movimentação</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.quantity, item.minimum);
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Min: {item.minimum} {item.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantity}</span>
                          <StatusBadge status={stockStatus.status}>
                            {stockStatus.label}
                          </StatusBadge>
                        </div>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-sm">{item.lastMovement}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border z-50">
                            <DropdownMenuItem>
                              <Plus className="h-4 w-4 mr-2" />
                              Entrada
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="h-4 w-4 mr-2" />
                              Saída
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="h-4 w-4 mr-2" />
                              Histórico
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}