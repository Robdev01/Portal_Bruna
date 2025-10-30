import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    permissoes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmSenha || !formData.permissoes) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.senha.length < 6) {
      toast.error("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (formData.senha !== formData.confirmSenha) {
      toast.error("As senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch("http://127.0.0.1:5000/api/v1/usuario/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          permissoes: formData.permissoes,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) throw new Error(data.erro || "Erro ao cadastrar usuário.");

      setShowModal(true);
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Erro inesperado ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl py-8">
          {/* 🔙 Botão de Voltar */}
          <div className="mb-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>

          <Card className="border-border shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Cadastro de Usuário</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Preencha as informações abaixo para criar uma nova conta
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Bruna Calheira"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permissoes">Tipo de Permissão *</Label>
                  <Select
                    value={formData.permissoes}
                    onValueChange={(value) => setFormData({ ...formData, permissoes: value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selecione o tipo de permissão" />
                    </SelectTrigger>
                    <SelectContent>                      
                      <SelectItem value="adv">Advogada</SelectItem>                      
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmSenha">Confirmar Senha *</Label>
                  <Input
                    id="confirmSenha"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmSenha}
                    onChange={(e) => setFormData({ ...formData, confirmSenha: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90">
                    {isLoading ? "Salvando..." : "Cadastrar"}
                  </Button>
                </div>
              </form>              
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ Modal de sucesso */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">Usuário cadastrado com sucesso!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              O usuário foi criado com sucesso e agora pode efetuar login no sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button onClick={() => navigate("/login")}>Ir para Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterUser;
