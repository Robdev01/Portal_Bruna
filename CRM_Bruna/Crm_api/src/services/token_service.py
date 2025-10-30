import jwt
from datetime import datetime, timedelta
from src.usuario.models import token_esta_invalido
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("CHAVE_SUPER")
ALGORITHM = "HS256"

def gerar_token(email):
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token):
    if token_esta_invalido(token):
        return None
    try:
        dados = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return dados["email"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
