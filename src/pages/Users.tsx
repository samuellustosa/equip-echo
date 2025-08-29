import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus, Edit, Trash2, Shield, ShieldCheck, Crown } from "lucide-react";
import { useState } from "react";
import { useUsers, NewUser, UserProfile, UpdatedUser } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { AddUserDialog } from "@/components/users/add-user-dialog";

export default function Users() {
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleAddUser = (newUser: NewUser) => {
    addUser(newUser);
  };

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setShowEditUserDialog(true);
  };

  const handleDelete = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDeleteUserDialog(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(String(selectedUser.id));
      setSelectedUser(null);
      setShowDeleteUserDialog(false);
    }
  };

  const handleUpdateUser = (id: string, updates: UpdatedUser) => {
    updateUser(id, updates);
    setSelectedUser(null);
    setShowEditUserDialog(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Manager":
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Admin: "destructive",
      Manager: "secondary", 
      User: "outline"
    };
    
    const labels: Record<string, string> = {
      Admin: "Administrador",
      Manager: "Gerente",
      User: "Usuário"
    };
    
    return (
      <Badge variant={variants[role] || "outline"} className="flex items-center gap-1">
        {getRoleIcon(role)}
        {labels[role] || role}
      </Badge>
    );
  };

  // Verificar se o usuário atual é Admin
  if (currentUser?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerenciar usuários e permissões</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:shadow-elegant transition-all"
          onClick={() => setShowAddUserDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>{users.length} usuário(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum usuário encontrado.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-medium p-2">Nome</TableHead>
                    <TableHead className="text-left font-medium p-2">Email</TableHead>
                    <TableHead className="text-left font-medium p-2">Permissão</TableHead>
                    <TableHead className="text-right font-medium p-2">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-b hover:bg-muted/50">
                      <TableCell className="p-2 font-medium">{user.name}</TableCell>
                      <TableCell className="p-2 text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="p-2">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                           <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user)}
                            disabled={user.email === currentUser?.email}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddUserDialog
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onSubmit={handleAddUser}
      />
      
      {selectedUser && (
        <EditUserDialog 
          open={showEditUserDialog}
          onOpenChange={setShowEditUserDialog}
          user={selectedUser}
          onSubmit={handleUpdateUser}
        />
      )}

      <DeleteConfirmationDialog
        open={showDeleteUserDialog}
        onOpenChange={setShowDeleteUserDialog}
        onConfirm={confirmDelete}
        title="Excluir Usuário"
        description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
      />
    </div>
  );
}