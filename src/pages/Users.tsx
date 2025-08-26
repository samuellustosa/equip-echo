import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerenciar usuários e permissões</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Esta página ainda está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum usuário encontrado.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}