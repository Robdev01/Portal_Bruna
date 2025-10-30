from flask import Flask
from src.contrato.router import contrato_bp
from src.cep.router import cep_bp
from src.usuario.router import usuario_bp
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

CORS(app)

# Registrar rotas do módulo contrato
app.register_blueprint(contrato_bp, url_prefix="/api/v1")
app.register_blueprint(cep_bp, url_prefix="/api/v1")
app.register_blueprint(usuario_bp, url_prefix="/api/v1")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
