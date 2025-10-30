import pymysql
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

def get_conectar_banco():
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 3306)),
        cursorclass=pymysql.cursors.DictCursor
    )



def validar_dados(dados: dict, campos_obrigatorios: list):
    faltando = [c for c in campos_obrigatorios if c not in dados or not dados[c]]
    if faltando:
        raise ValueError(f"Campos obrigatórios faltando: {', '.join(faltando)}")

def models_salvar_arquivo_gerado(nome_cliente, caminho_zip):
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO documentos_gerados (nome_cliente, caminho_arquivo, criado_em)
            VALUES (%s, %s, NOW())
            """
            cursor.execute(sql, (nome_cliente, caminho_zip))
            conn.commit()
            return True
    except Exception as e:
        print(f"❌ Erro ao salvar caminho: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
