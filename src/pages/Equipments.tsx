import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Filter, MoreHorizontal, Wrench, History } from "lucide-react";
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
const equipments = [
  {
    id: 1,
    name: "Impressora HP LaserJet Pro",
    model: "M404dn",
    sector: "Administração", 
    responsible: "Maria Silva",
    status: "Em Dia",
    lastMaintenance: "2024-08-20",
    nextMaintenance: "2024-09-20",
    maintenanceInterval: 30
  },
  {
    id: 2,
    name: "Notebook Dell Inspiron",
    model: "15 3000",
    sector: "TI",
    responsible: "João Santos",
    status: "Com Aviso", 
    lastMaintenance: "2024-08-15",
    nextMaintenance: "2024-08-25",
    maintenanceInterval: 10
  },
  {
    id: 3,
    name: "Projetor Epson",
    model: "PowerLite X41+",
    sector: "Sala de Reunião",
    responsible: "Ana Costa",
    status: "Atrasado",
    lastMaintenance: "2024-07-30", 
    nextMaintenance: "2024-08-15",
    maintenanceInterval: 15
  },
  {
    id: 4,
    name: "Scanner Canon",
    model: "CanoScan LiDE 400",
    sector: "Recepção",
    responsible: "Carlos Lima",
    status: "Em Dia",
    lastMaintenance: "2024-08-18",
    nextMaintenance: "2024-09-18",
    maintenanceInterval: 30
  }
];

export default function Equipments() {
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Equipamentos</h1>
          <p className="text-muted-foreground">Gerenciar equipamentos e suas manutenções</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-elegant transition-all">
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.map((equipment) => (
                  <TableRow key={equipment.id} className="hover:bg-muted/50">
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
                    <TableCell className="text-sm">{equipment.lastMaintenance}</TableCell>
                    <TableCell className="text-sm">{equipment.nextMaintenance}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border z-50">
                          <DropdownMenuItem>
                            <Wrench className="h-4 w-4 mr-2" />
                            Registrar Manutenção
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="h-4 w-4 mr-2" />
                            Ver Histórico
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}