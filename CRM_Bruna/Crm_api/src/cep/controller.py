from flask import jsonify, request
from src.services.cep_service import buscar_cep


def controller_endereco_por_cep():
    """
    Controlador que recebe o CEP, valida e retorna o endereço completo.
    """
    cep = request.args.get("cep", "").strip()
    if not cep:
        return jsonify({"erro": "CEP é obrigatório"}), 400

    endereco = buscar_cep(cep)
    if not endereco:
        return jsonify({"erro": "CEP não encontrado"}), 404

    return jsonify(endereco), 200
