from flask import Blueprint
from src.cep.controller import controller_endereco_por_cep

cep_bp = Blueprint("cep", __name__)

# Define a rota para consulta de CEP
@cep_bp.route("/cep", methods=["GET"])
def consultar_cep():
    return controller_endereco_por_cep()
