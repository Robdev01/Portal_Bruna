import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, LayoutGrid, FileText, LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<{ nome?: string; email?: string } | null>(null);

  // 🔹 Recupera os dados do usuário do localStorage
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    } else {
      navigate("/login"); // redireciona se não estiver logado
    }
  }, [navigate]);

  // 🔹 Logout (invalida token e limpa localStorage)
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/usuario/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        toast.success("Logout realizado com sucesso!");
        navigate("/login");
      } else {
        toast.error("Erro ao fazer logout");
      }
    } catch {
      toast.error("Falha ao conectar com o servidor");
    }
  };

  const menuItems = [
    {
      title: "Perfis de Usuários",
      description: "Listagem dos Usuários",
      icon: Users,
      path: "/Perfis",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Cadastro de Usuários",
      description: "Cadastrar novo usuário",
      icon: Users,
      path: "/Perfis-register",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Emissão De Documentos",
      description: "Aqui você poderá emitir contrato, declaração e procuração",
      icon: Settings,
      path: "/form",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Board de Projetos",
      description: "Gerenciar cards e tarefas",
      icon: LayoutGrid,
      path: "/board",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Documentos",
      description: "Gerenciar documentos",
      icon: FileText,
      path: "/Documentos",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 🔹 Cabeçalho */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading text-foreground">Portal de Configuração</h1>
            <p className="text-sm text-muted-foreground">Vivo Capital</p>
          </div>

          {/* 🔹 Saudação e botão de logout */}
          <div className="flex items-center gap-4">
            {usuario && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{usuario.nome}</span>
              </p>
            )}
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* 🔹 Conteúdo principal */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-heading text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Bem-vindo{usuario?.nome ? `, ${usuario.nome.split(" ")[0]}` : ""}!  
            Selecione uma opção abaixo.
          </p>
        </div>

        {/* 🔹 Cards de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} to={item.path}>
                <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
