from datetime import datetime
from pathlib import Path
import zipfile
import re
from io import BytesIO
from dateutil.relativedelta import relativedelta
from src.services.docx_service import preencher_modelo
from src.services.cep_service import buscar_cep
from src.services.utils import numero_para_extenso, data_por_extenso, cidade_estado_por_extenso

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)


def calcular_idade(data_nascimento: str):
    try:
        nascimento = datetime.strptime(data_nascimento, "%d/%m/%Y")
        hoje = datetime.now()
        return hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))
    except:
        return 999


def formatar_cpf(cpf: str):
    """Formata CPF no padrão 000.000.000-00"""
    if not cpf:
        return ""
    numeros = ''.join(filter(str.isdigit, cpf))
    if len(numeros) == 11:
        return f"{numeros[:3]}.{numeros[3:6]}.{numeros[6:9]}-{numeros[9:]}"
    return cpf


def formatar_rg(rg: str):
    """Formata RG no padrão 00.000.000-X"""
    if not rg:
        return ""
    numeros = ''.join(filter(str.isalnum, rg))
    if len(numeros) >= 8:
        return f"{numeros[:2]}.{numeros[2:5]}.{numeros[5:8]}-{numeros[-1]}"
    return rg


def tratar_dados(dados: dict):
    """Trata e normaliza CPF, RG, valores e datas automaticamente"""
    # 🔹 Busca CEP e preenche endereço, cidade e estado
    cep_info = buscar_cep(dados.get("ENDERECOCEP", ""))
    for key in ["ENDERECORUA", "BAIRRO", "ENDERECOCIDADE", "ENDERECOESTADO"]:
        if not dados.get(key) and cep_info.get(key):
            dados[key] = cep_info[key]

    # 🔹 CPF e RG formatados
    dados["NUMEROCPF"] = formatar_cpf(dados.get("NUMEROCPF", dados.get("NUMERO_CPF", "")))
    dados["NUMERORG"] = formatar_rg(dados.get("NUMERORG", dados.get("NUMERO_RG", "")))

    # 🔹 Gera campo de data completa por extenso
    cidade = dados.get("ENDERECOCIDADE", "")
    estado = dados.get("ENDERECOESTADO", "")
    hoje = datetime.now()
    dados["DATACOMMESEXTENSO"] = f"{cidade_estado_por_extenso(cidade, estado)}, {data_por_extenso(hoje)}"

    # 🔹 Gera valores por extenso, se forem numéricos
    for campo in ["VALORREAIS", "VALORENTRADA", "VALORPARCELA"]:
        valor = dados.get(campo)
        if valor:
            try:
                valor_float = float(str(valor).replace(",", "."))
                dados[f"{campo}EXTENSO"] = numero_para_extenso(valor_float)
            except:
                dados[f"{campo}EXTENSO"] = str(valor)

    # 🔹 Calcula DATAULTIMAPARCELA e DATAULTIMAPARCELAEXTENSO automaticamente
    try:
        if dados.get("DATAPRIMEIRAPARCELA") and dados.get("NUMEROPARCELAS"):
            primeira = datetime.strptime(dados["DATAPRIMEIRAPARCELA"], "%d/%m/%Y")
            qtd = int(dados.get("NUMEROPARCELAS", 1))
            ultima = primeira + relativedelta(months=qtd - 1)
            dados["DATAULTIMAPARCELA"] = ultima.strftime("%d/%m/%Y")
            dados["DATAULTIMAPARCELAEXTENSO"] = data_por_extenso(ultima)
        else:
            dados["DATAULTIMAPARCELA"] = ""
            dados["DATAULTIMAPARCELAEXTENSO"] = ""
    except Exception:
        dados["DATAULTIMAPARCELA"] = ""
        dados["DATAULTIMAPARCELAEXTENSO"] = ""

    # 🔹 Extrai automaticamente o dia de vencimento da primeira parcela
    try:
        if dados.get("DATAPRIMEIRAPARCELA"):
            data_1 = datetime.strptime(dados["DATAPRIMEIRAPARCELA"], "%d/%m/%Y")
            dados["VENCIMENTODIA"] = str(data_1.day)
        else:
            dados["VENCIMENTODIA"] = ""
    except:
        dados["VENCIMENTODIA"] = ""

    # 🔹 🔥 CONVERSÃO FINAL PARA STRING 🔥
    dados = {chave: str(valor or "") for chave, valor in dados.items()}

    return dados

def gerar_documento(dados: dict):
    """
    Gera os documentos conforme o tipo informado:
    - com_crianca → contrato mãe + procurações mãe/filho + declarações mãe/filho
    - sem_crianca → contrato + procuração simples + declaração simples
    """
    tipo = dados.get("tipo", "").lower()
    if not tipo:
        raise ValueError("Campo 'tipo' é obrigatório. Envie 'com_crianca' ou 'sem_crianca'.")

    # 🔹 Trata os dados
    dados = tratar_dados(dados)

    modelos = []

    # 🔹 Define documentos conforme tipo
    match tipo:
        case "com_crianca":
            modelos.extend([
                ("contrato", TEMPLATES_DIR / "Skillbase - Modelo Contrato_.docx"),
                ("procuracao_mae", TEMPLATES_DIR / "Skillbase - Modelo Procuração Mãe.docx"),
                ("procuracao_filho", TEMPLATES_DIR / "Skillbase - Modelo Procuração Filhos.docx"),
                ("declaracao_mae", TEMPLATES_DIR / "Skillbase - Modelo DECLARAÇÃO DE HIPOSSUFICIÊNCIA mãe.docx"),
                ("declaracao_filho", TEMPLATES_DIR / "Skillbase - Modelo DECLARAÇÃO DE HIPOSSUFICIÊNCIA filhos.docx"),
            ])
        case "sem_crianca":
            modelos.extend([
                ("contrato", TEMPLATES_DIR / "Skillbase - Modelo Contrato_.docx"),
                ("procuracao", TEMPLATES_DIR / "Skillbase - Modelo Procuração.docx"),
                ("declaracao", TEMPLATES_DIR / "Skillbase - Modelo DECLARAÇÃO DE HIPOSSUFICIÊNCIA.docx"),
            ])
        case _:
            raise ValueError("Tipo inválido. Use 'com_crianca' ou 'sem_crianca'.")

    # 🔹 Gera e compacta os arquivos
    arquivos_gerados = []
    for nome, modelo_path in modelos:
        cpf_limpo = re.sub(r'\D', '', dados.get("NUMEROCPF", ""))  # remove pontos e traços
        nome_limpo = re.sub(r'[^A-Za-z0-9_]+', '_', dados.get("NOME", "").strip())  # tira acentos/espaços
        nome_saida = f"{nome_limpo}_{cpf_limpo}.docx"

        output_path = OUTPUT_DIR / nome_saida
        preencher_modelo(str(modelo_path), dados, str(output_path))
        arquivos_gerados.append(output_path)

    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file_path in arquivos_gerados:
            zipf.write(file_path, arcname=file_path.name)
    zip_buffer.seek(0)

    return zip_buffer