import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>Esta página ainda está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <SettingsIcon className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma configuração disponível no momento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}