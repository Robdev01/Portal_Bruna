import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Pencil, XCircle, UserCheck } from "lucide-react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  permissoes: string;
  ativo: number;
};

const PerfisList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtered, setFiltered] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [novaPermissao, setNovaPermissao] = useState("");
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const resp = await fetch("http://127.0.0.1:5000/api/v1/usuario/listar");
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.erro || "Erro ao buscar usuários");
      setUsuarios(data);
      setFiltered(data);
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleAtivar = async (id: number) => {
    try {
      const resp = await fetch(`http://127.0.0.1:5000/api/v1/usuario/ativar/${id}`, {
        method: "PATCH",
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.erro || "Erro ao ativar usuário");
      toast.success("Usuário ativado com sucesso!");
      fetchUsuarios();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Erro ao ativar usuário");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`http://127.0.0.1:5000/api/v1/usuario/${id}`, {
        method: "DELETE",
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.erro || "Erro ao excluir usuário");
      toast.success("Usuário excluído com sucesso!");
      fetchUsuarios();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Erro ao excluir usuário");
    }
  };

  const handlePermissaoChange = async () => {
    if (!editando) return;

    try {
      const resp = await fetch(`http://127.0.0.1:5000/api/v1/usuario/permissao/${editando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissoes: novaPermissao }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.erro || "Erro ao atualizar permissão");

      toast.success("Permissão atualizada com sucesso!");
      setEditando(null);
      fetchUsuarios();
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Erro ao atualizar permissão");
    }
  };

  useEffect(() => {
    if (!search.trim()) setFiltered(usuarios);
    else {
      setFiltered(
        usuarios.filter(
          (u) =>
            u.nome.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, usuarios]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* 🔙 Botão de Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-3xl font-heading text-foreground mb-2">Usuários</h1>
        <p className="text-muted-foreground mb-4">
          Gerencie as contas cadastradas, permissões e status dos usuários.
        </p>

        {/* 🔍 Campo de busca */}
        <Input
          placeholder="Buscar por nome ou e-mail"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-border bg-background"
        />

        {/* 📋 Listagem */}
        {loading ? (
          <p>Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((u) => (
              <Card
                key={u.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-border/50 hover:border-accent/50 hover:shadow-md transition-all"
              >
                <CardContent className="p-0 w-full md:w-auto">
                  <h2 className="text-lg font-semibold text-foreground">{u.nome}</h2>
                  <p className="text-sm text-muted-foreground">{u.email}</p>

                  <Badge
                    className={`mt-2 ${
                      u.ativo
                        ? "bg-primary text-white"
                        : "bg-destructive text-white"
                    }`}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </CardContent>

                <div className="flex gap-3 mt-3 md:mt-0">
                  {!u.ativo && (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleAtivar(u.id)}
                    >
                      <UserCheck className="w-4 h-4 mr-1" /> Ativar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditando(u);
                      setNovaPermissao(u.permissoes);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ✏️ Modal de Edição */}
        <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Permissão</DialogTitle>
            </DialogHeader>

            <Select value={novaPermissao} onValueChange={(v) => setNovaPermissao(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione nova permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="adv">Advogada</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditando(null)}>
                Cancelar
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handlePermissaoChange}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PerfisList;
