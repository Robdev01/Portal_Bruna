import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState("");
  const [formData, setFormData] = useState({
    tipo: "",
    NOMERESPONSAVEL: "",
    NOMECRIANCA: "",
    NOME: "",
    NOMEREPRESENTANTE: "",
    NACIONALDADE: "",
    DATANASCIMENTO: "",
    ESTADOCIVIL: "",
    NUMEROCPF: "",
    NUMERORG: "",
    ENDERECORUA: "",
    ENDERECONUMERO: "",
    COMPLEMENTO: "",
    BAIRRO: "",
    ENDERECOCIDADE: "",
    ENDERECOESTADO: "",
    ENDERECOCEP: "",
    ACAOPROCESSO: "",
    NUMEROPROCESSO: "",
    VALORREAIS: "",
    VALOREXTENSO: "",
    VALORENTRADA: "",
    VALORENTRADAEXTENSO: "",
    NUMEROPARCELAS: "",
    VALORPARCELA: "",
    PARCELAEXTENSO: "",
    VENCIMENTODIA: "",
    DATAPRIMEIRAPARCELA: "",
    DATAULTIMAPARCELA: "",
    DATACOMMESEXTENSO: "",
  });

  // 🔹 Atualiza e força letras maiúsculas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  // 🔹 Busca endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/cep?cep=${cep}`);
      if (!response.ok) throw new Error("Erro ao consultar CEP");
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        ENDERECORUA: (data.ENDERECORUA || "").toUpperCase(),
        BAIRRO: (data.BAIRRO || "").toUpperCase(),
        ENDERECOCIDADE: (data.ENDERECOCIDADE || "").toUpperCase(),
        ENDERECOESTADO: (data.ENDERECOESTADO || "").toUpperCase(),
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("CEP não encontrado");
    }
  };

  // 🔹 Envia o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/gerar-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao gerar documento");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documentos_gerados.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Documentos gerados com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar documentos");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Calcula automaticamente a data da última parcela
  const calcularDataUltimaParcela = (numeroParcelas: string, dataPrimeiraParcela: string) => {
    if (!numeroParcelas || !dataPrimeiraParcela) return "";

    const parcelas = parseInt(numeroParcelas);
    if (isNaN(parcelas) || parcelas < 1) return "";

    const primeira = new Date(dataPrimeiraParcela);
    const ultima = new Date(primeira);
    ultima.setMonth(primeira.getMonth() + (parcelas - 1)); // soma meses

    // formato YYYY-MM-DD (para o input type="date")
    return ultima.toISOString().split("T")[0];
  };
  // 🔹 Formata o CPF automaticamente enquanto o usuário digita
  const formatarCpf = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
    return apenasNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // 🔹 Limpa e padroniza o RG (somente números e X, se tiver)
  const formatarRg = (valor: string) => {
    return valor
      .toUpperCase()
      .replace(/[^0-9X]/g, "")
      .slice(0, 12); // limite razoável
  };


  // 🔹 Estrutura dos blocos
  const sections = [
    {
      title: "Dados Pessoais",
      fields: [
        { name: "NOME", label: "Nome Completo", type: "text" },
        { name: "NOMEREPRESENTANTE", label: "Nome do Representante", type: "text" },
        { name: "NACIONALDADE", label: "Nacionalidade", type: "text" },
        { name: "DATANASCIMENTO", label: "Data de Nascimento", type: "date" },
        { name: "ESTADOCIVIL", label: "Estado Civil", type: "text" },
      ],
    },
    {
      title: "Documentos",
      fields: [
        { name: "NUMEROCPF", label: "Número do CPF", type: "text" },
        { name: "NUMERORG", label: "Número do RG", type: "text" },
      ],
    },
    {
      title: "Endereço",
      fields: [
        { name: "ENDERECOCEP", label: "CEP", type: "text" },
        { name: "ENDERECORUA", label: "Rua", type: "text" },
        { name: "ENDERECONUMERO", label: "Número", type: "text" },
        { name: "COMPLEMENTO", label: "Complemento", type: "text" },
        { name: "BAIRRO", label: "Bairro", type: "text" },
        { name: "ENDERECOCIDADE", label: "Cidade", type: "text" },
        { name: "ENDERECOESTADO", label: "Estado", type: "text" },
      ],
    },
    {
      title: "Informações do Processo",
      fields: [
        { name: "ACAOPROCESSO", label: "Ação do Processo", type: "text" },
        { name: "NUMEROPROCESSO", label: "Número do Processo", type: "text" },
      ],
    },
    {
      title: "Valores e Parcelas",
      fields: [
        { name: "VALORREAIS", label: "Valor em Reais", type: "text" },

        { name: "VALORENTRADA", label: "Valor da Entrada", type: "text" },

        { name: "NUMEROPARCELAS", label: "Número de Parcelas", type: "number" },
        { name: "VALORPARCELA", label: "Valor da Parcela", type: "text" },

        { name: "VENCIMENTODIA", label: "Dia do Vencimento", type: "number" },
        { name: "DATAPRIMEIRAPARCELA", label: "Data da Primeira Parcela", type: "date" },
        { name: "DATAULTIMAPARCELA", label: "Data da Última Parcela", type: "date" },

      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 🔹 Cabeçalho */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-heading text-foreground">Cadastro de Documentos</h1>
              <p className="text-sm text-muted-foreground">Preencha os dados abaixo</p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Gerando..." : "Gerar Documentos"}
          </Button>
        </div>
      </header>

      {/* 🔹 Corpo */}
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🔸 Tipo de Documento */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Tipo de Documento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Selecione o Tipo</Label>
                  <Select
                    value={tipo}
                    onValueChange={(v) => {
                      setTipo(v);
                      setFormData({ ...formData, tipo: v });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="com_crianca">Com criança</SelectItem>
                      <SelectItem value="sem_crianca">Sem criança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tipo === "com_crianca" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="NOMECRIANCA">Nome da Criança</Label>
                      <Input
                        id="NOMECRIANCA"
                        name="NOMECRIANCA"
                        type="text"
                        value={formData.NOMECRIANCA}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="NOMERESPONSAVEL">Nome do Responsável</Label>
                      <Input
                        id="NOMERESPONSAVEL"
                        name="NOMERESPONSAVEL"
                        type="text"
                        value={formData.NOMERESPONSAVEL}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 🔸 Demais seções */}
          {sections.map((section, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          let newValue = value.toUpperCase();
                          let updatedData = { ...formData };
                        
                          // 🔹 CPF: aplica formatação ao digitar
                          if (name === "NUMEROCPF") {
                            newValue = formatarCpf(value);
                          }
                        
                          // 🔹 RG: limpa caracteres inválidos
                          if (name === "NUMERORG") {
                            newValue = formatarRg(value);
                          }
                        
                          updatedData[name] = newValue;
                        
                          // 🔹 CEP: busca endereço automático
                          if (name === "ENDERECOCEP") {
                            const cep = value.replace(/\D/g, "");
                            updatedData.ENDERECOCEP = cep;
                            setFormData(updatedData);
                            if (cep.length === 8) buscarEnderecoPorCep(cep);
                            return;
                          }
                        
                          // 🔹 Parcelas automáticas
                          if (name === "NUMEROPARCELAS" || name === "DATAPRIMEIRAPARCELA") {
                            const ultima = calcularDataUltimaParcela(
                              name === "NUMEROPARCELAS" ? value : formData.NUMEROPARCELAS,
                              name === "DATAPRIMEIRAPARCELA" ? value : formData.DATAPRIMEIRAPARCELA
                            );
                            if (ultima) updatedData.DATAULTIMAPARCELA = ultima;
                          }
                        
                          setFormData(updatedData);
                        }}
                        

                        className="bg-muted border-border"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </form>
      </main>
    </div>
  );
};

export default Form;
