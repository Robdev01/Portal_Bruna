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


def models_criar_usuario(nome, email, senha, permissoes="usuario"):
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO crm_bruna_calheira_adv_usuarios (nome, email, senha, permissoes, ativo, criado_em, atualizado_em)
                VALUES (%s, %s, %s, %s, 1, %s, %s)
            """
            cursor.execute(sql, (nome, email, senha, permissoes, datetime.now(), datetime.now()))
            conn.commit()
            return True
    except pymysql.err.IntegrityError:
        return False
    finally:
        conn.close()


def models_buscar_usuario_por_email(email):
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM crm_bruna_calheira_adv_usuarios WHERE email = %s", (email,))
            usuario = cursor.fetchone()
            return usuario
    except Exception as e:
        print(f"❌ Erro ao buscar usuário: {e}")
        return None
    finally:
        conn.close()


def models_atualizar_status_usuario(usuario_id, ativo):
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE crm_bruna_calheira_adv_usuarios 
                SET ativo = %s, atualizado_em = %s 
                WHERE id = %s
            """, (ativo, datetime.now(), usuario_id))
            conn.commit()
            return True
    except Exception as e:
        print(f"❌ Erro ao atualizar status: {e}")
        return False
    finally:
        conn.close()

def models_lista_usuarios():
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT id, nome, email, permissoes, ativo FROM crm_bruna_calheira_adv_usuarios"
            cursor.execute(sql)
            return cursor.fetchall()  # retorna lista de dicts
    except Exception as e:
        print(f"❌ Erro ao listar usuários: {e}")
        return []
    finally:
        conn.close()



def salvar_token_invalido(token):
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO crm_bruna_calheira_adv_tokens_invalidos (token, criado_em)
                VALUES (%s, %s)
            """
            cursor.execute(sql, (token, datetime.now()))
            conn.commit()
    except Exception as e:
        print(f"❌ Erro ao salvar token inválido: {e}")
    finally:
        conn.close()


def token_esta_invalido(token):
    conn = get_conectar_banco()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT COUNT(*) AS total FROM crm_bruna_calheira_adv_tokens_invalidos WHERE token = %s"
            cursor.execute(sql, (token,))
            resultado = cursor.fetchone()
            return resultado["total"] > 0
    except Exception as e:
        print(f"❌ Erro ao verificar token inválido: {e}")
        return False
    finally:
        conn.close()
