from flask import jsonify, request
from src.usuario.models import (
    models_criar_usuario,
    models_buscar_usuario_por_email,
    models_atualizar_status_usuario,
    salvar_token_invalido,
    models_lista_usuarios
)

from src.services.token_service import gerar_token, verificar_token

# 🔹 Cadastro
def controller_cadastrar_usuario():
    dados = request.get_json()
    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    permissoes = dados.get("permissoes", "usuario")  # 🔹 Padrão: 'usuario'

    if not all([nome, email, senha]):
        return jsonify({"erro": "Todos os campos são obrigatórios"}), 400

    if not models_criar_usuario(nome, email, senha, permissoes):
        return jsonify({"erro": "E-mail já cadastrado"}), 409

    return jsonify({"mensagem": "Usuário cadastrado com sucesso"}), 201

# 🔹 Login
def controller_login_usuario():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("senha")

    usuario = models_buscar_usuario_por_email(email)
    if not usuario or usuario["senha"] != senha:
        return jsonify({"erro": "E-mail ou senha inválidos"}), 401

    token = gerar_token(usuario["email"])

    return jsonify({
        "token": token,
        "usuario": {
            "nome": usuario["nome"],
            "email": usuario["email"],
            "permissoes": usuario["permissoes"],
            "ativo": usuario["ativo"]
        }
    }), 200

# 🔹 Logout
def controller_logout_usuario():
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"erro": "Token ausente"}), 400

    token = auth.split(" ")[1]
    email = verificar_token(token)
    if not email:
        return jsonify({"erro": "Token inválido ou expirado"}), 401

    salvar_token_invalido(token)
    return jsonify({"mensagem": "Logout realizado com sucesso"}), 200

# 🔹 Ativar/Inativar
def controller_alterar_status_usuario(usuario_id):
    dados = request.get_json()
    ativo = dados.get("ativo")

    if ativo not in [0, 1]:
        return jsonify({"erro": "Valor inválido (use 0 ou 1)"}), 400

    models_atualizar_status_usuario(usuario_id, ativo)
    return jsonify({"mensagem": "Status do usuário atualizado"}), 200

def controller_get_all_users():
    try:
        usuarios = models_lista_usuarios()
        if not usuarios:
            return {"mensagem": "Nenhum usuário encontrado."}, 404
        return usuarios, 200  # ✅ Retorna direto a lista e o status code
    except Exception as e:
        print(f"❌ Erro no controller_get_all_users: {e}")
        return {"erro": str(e)}, 500