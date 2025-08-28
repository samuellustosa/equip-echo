// Path: src/components/equipments/maintenance-history-dialog.tsx

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceRecord } from "@/hooks/useEquipments";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

interface MaintenanceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: number | null;
  equipmentName: string | null;
}

export function MaintenanceHistoryDialog({ open, onOpenChange, equipmentId, equipmentName }: MaintenanceHistoryDialogProps) {
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!equipmentId) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("maintenance_records")
        .select("*")
        .eq("equipment_id", equipmentId)
        .order("date", { ascending: false });

      if (error) {
        toast.error("Erro ao buscar o histórico de manutenção.");
        console.error(error);
      } else {
        setHistory(data);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [equipmentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórico de Manutenção</DialogTitle>
          <DialogDescription>
            {equipmentName ? `Registros de manutenção para: ${equipmentName}` : "Registros de manutenção"}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando histórico...</p>
          </div>
        ) : history.length === 0 ? (
          <Card className="border-l-4 border-muted-foreground/50">
            <CardContent className="flex items-center gap-4 py-4">
              <History className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nenhum registro de manutenção encontrado para este equipamento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.responsible}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{record.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}