import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUsers, NewUser, UserProfile, UpdatedUser } from "@/hooks/useUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";

export default function Users() {
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      addUser(selectedUser as NewUser);
    }
    // setFormData({ name: "", email: "", role: "Técnico" }); // Ajustado para usar o estado correto
    setShowAddUserDialog(false);
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
                    <TableHead className="text-left font-medium p-2">Função</TableHead>
                    <TableHead className="text-right font-medium p-2">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-b hover:bg-muted/50">
                      <TableCell className="p-2 font-medium">{user.name}</TableCell>
                      <TableCell className="p-2 text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="p-2">{user.role}</TableCell>
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

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>Preencha os detalhes do novo usuário.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Nome Completo" value={""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemplo.com" value={""} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
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