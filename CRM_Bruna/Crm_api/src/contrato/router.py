from flask import Blueprint, request, send_file, jsonify
from src.contrato.controller import gerar_documento

contrato_bp = Blueprint("contrato", __name__)

@contrato_bp.route("/gerar-documento", methods=["POST"])
def gerar_doc():
    try:
        dados = request.get_json()
        if not dados:
            return jsonify({"erro": "JSON inválido ou vazio."}), 400

        print("📦 Dados recebidos:", dados)  # <-- loga tudo o que chega

        zip_buffer = gerar_documento(dados)
        return send_file(
            zip_buffer,
            as_attachment=True,
            download_name="documentos_gerados.zip",
            mimetype="application/zip"
        )

    except Exception as e:
        import traceback
        print("❌ ERRO AO GERAR DOCUMENTO:")
        print(traceback.format_exc())  # <-- mostra o erro completo no terminal
        return jsonify({"erro": str(e)}), 500
