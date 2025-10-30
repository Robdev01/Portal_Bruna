# espaço reservado para funções auxiliares futuras
from num2words import num2words
from datetime import datetime


def numero_para_extenso(valor: float):
    try:
        inteiro = int(valor)
        centavos = int(round((valor - inteiro) * 100))
        extenso = num2words(inteiro, lang='pt_BR')
        if centavos > 0:
            extenso += f" e {num2words(centavos, lang='pt_BR')} centavos"
        return extenso
    except Exception:
        return str(valor)


def data_por_extenso(data: datetime):
    """Converte uma data para o formato '29 de outubro de 2025'."""
    meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
    return f"{data.day} de {meses[data.month - 1]} de {data.year}"


def cidade_estado_por_extenso(cidade: str, estado: str, incluir_prefixo=True):
    """Gera texto como 'São Bernardo do Campo, SP' ou com prefixo 'São Bernardo do Campo, ...'"""
    if not cidade or not estado:
        return ""
    texto = f"{cidade}, {estado}"
    return texto if not incluir_prefixo else f"{texto}"



