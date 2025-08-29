import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Plus, Edit, Trash2, Shield, ShieldCheck, Crown, Search, Users as UsersIcon, Filter } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Users() {
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

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
        return <Shield className="h-4 w-4 text-muted-foreground" />;
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
      <Badge variant={variants[role] || "outline"} className="flex items-center gap-1 text-xs">
        {getRoleIcon(role)}
        {labels[role] || role}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Verificar se o usuário atual é Admin
  if (currentUser?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto mb-4">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground max-w-md">
            Você não tem permissão para gerenciar usuários. Esta área é restrita apenas para administradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Usuários</h1>
              <p className="text-muted-foreground">Gerenciar usuários e permissões do sistema</p>
            </div>
          </div>
        </div>
        <Button 
          className="bg-gradient-primary hover:shadow-elegant transition-all h-11"
          onClick={() => setShowAddUserDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Filtrar por permissão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as permissões</SelectItem>
              <SelectItem value="Admin">Administradores</SelectItem>
              <SelectItem value="Manager">Gerentes</SelectItem>
              <SelectItem value="User">Usuários</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Lista de Usuários
              </CardTitle>
              <CardDescription>
                {filteredUsers.length} de {users.length} usuário(s) 
                {searchTerm && ` • Filtro: "${searchTerm}"`}
                {roleFilter !== "all" && ` • Permissão: ${roleFilter}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando usuários...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                {users.length === 0 ? (
                  <>
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">Nenhum usuário encontrado</p>
                    <p className="text-sm">Adicione o primeiro usuário ao sistema.</p>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">Nenhum resultado encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-left font-semibold">Usuário</TableHead>
                    <TableHead className="text-left font-semibold">Email</TableHead>
                    <TableHead className="text-left font-semibold">Permissão</TableHead>
                    <TableHead className="text-left font-semibold">Criado em</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            {user.email === currentUser?.email && (
                              <span className="text-xs text-primary font-medium">Você</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="py-4">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="py-4 text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user)}
                            disabled={user.email === currentUser?.email}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:border-destructive/20 disabled:opacity-50"
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

      {/* Dialogs */}
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
        description={
          selectedUser ? 
          `Tem certeza que deseja excluir o usuário "${selectedUser.name}"? Esta ação não pode ser desfeita e removerá permanentemente o acesso do usuário ao sistema.` :
          "Tem certeza que deseja excluir este usuário?"
        }
      />
    </div>
  );
}