import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>Gerencie as configurações de sua conta e notificações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Notificações por Email</h4>
              <p className="text-sm text-muted-foreground">
                Receba alertas sobre manutenções e estoque por email.
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Tema Escuro</h4>
              <p className="text-sm text-muted-foreground">
                Ativar o tema escuro para o painel de controle.
              </p>
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>Configurações avançadas do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <SettingsIcon className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma configuração avançada disponível no momento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}