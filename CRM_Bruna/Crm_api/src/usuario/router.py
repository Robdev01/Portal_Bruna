from flask import Blueprint, jsonify
from src.usuario.controller import (
    controller_cadastrar_usuario,
    controller_login_usuario,
    controller_logout_usuario,
    controller_alterar_status_usuario,
    controller_get_all_users
)

usuario_bp = Blueprint("usuario", __name__)

@usuario_bp.route("/usuario/cadastrar", methods=["POST"])
def route_cadastrar():
    return controller_cadastrar_usuario()

@usuario_bp.route("/usuario/login", methods=["POST"])
def route_login():
    return controller_login_usuario()

@usuario_bp.route("/usuario/logout", methods=["POST"])
def route_logout():
    return controller_logout_usuario()

@usuario_bp.route("/usuario/<int:usuario_id>/ativar", methods=["PUT"])
def route_ativar(usuario_id):
    return controller_alterar_status_usuario(usuario_id)

@usuario_bp.route("/usuario/listar", methods=["GET"])
def get_users():
    data, status = controller_get_all_users()
    return jsonify(data), status
