import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowLeft, GripVertical, X } from "lucide-react";
import { toast } from "sonner";

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const Board = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "1",
      title: "Backlog de Projeto",
      cards: [
        { id: "1", title: "O que é: SCRUM", description: "Descrição do card" },
        { id: "2", title: "Reuniões", description: "Organização de reuniões" }
      ]
    },
    {
      id: "2",
      title: "Backlog de Sprint",
      cards: [
        { id: "3", title: "O que é: SPRINT", description: "Detalhes da sprint" }
      ]
    },
    {
      id: "3",
      title: "A fazer",
      cards: [
        { id: "4", title: "Dicas de uso 💡", description: "Dicas importantes" },
        { id: "5", title: "Pra quem organiza (SM/Líder)", description: "Informações para líderes" },
        { id: "6", title: "Pra quem participa", description: "Informações para participantes" }
      ]
    },
    {
      id: "4",
      title: "Em andamento",
      cards: []
    },
    {
      id: "5",
      title: "Feito",
      cards: []
    }
  ]);

  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");

  const addCard = (columnId: string) => {
    if (!newCardTitle.trim()) {
      toast.error("Por favor, adicione um título para o card");
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      title: newCardTitle,
      description: newCardDescription
    };

    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    ));

    setNewCardTitle("");
    setNewCardDescription("");
    setActiveColumnId(null);
    toast.success("Card adicionado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-heading text-foreground">Board de Projetos</h1>
              <p className="text-sm text-muted-foreground">Modelo de Projeto (SCRUM)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <Card className="border-border bg-card/80">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-heading">{column.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10"
                      onClick={() => setActiveColumnId(activeColumnId === column.id ? null : column.id)}
                    >
                      {activeColumnId === column.id ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeColumnId === column.id && (
                    <Card className="bg-muted border-primary/50 shadow-lg">
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-2">
                          <Input
                            placeholder="Título do card..."
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            className="bg-background border-border"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Descrição (opcional)..."
                            value={newCardDescription}
                            onChange={(e) => setNewCardDescription(e.target.value)}
                            className="bg-background border-border resize-none"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => addCard(column.id)}
                            className="flex-1 bg-primary hover:bg-primary/90"
                            size="sm"
                          >
                            Adicionar Card
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveColumnId(null);
                              setNewCardTitle("");
                              setNewCardDescription("");
                            }}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {column.cards.map((card) => (
                    <Card key={card.id} className="bg-muted border-border hover:border-accent/50 transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex-1">
                            <h4 className="font-body font-semibold text-sm mb-1">{card.title}</h4>
                            {card.description && (
                              <p className="text-xs text-muted-foreground">{card.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Board;
