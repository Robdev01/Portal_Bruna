from flask import Blueprint, request
from src.cep.controller import controller_endereco_por_cep

cep_bp = Blueprint("cep", __name__)

# Define a rota para consulta de CEP
@cep_bp.route("/cep", methods=["GET"])
def consultar_cep():
    print("📬 Headers:", dict(request.headers))  # mostra cabeçalhos
    print("📨 Args (query string):", request.args)  # ex: ?cep=09725120

    return controller_endereco_por_cep()