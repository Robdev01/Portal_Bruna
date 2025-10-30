import requests

def buscar_cep(cep: str):
    cep = cep.replace("-", "").strip()
    if not cep:
        return {}

    try:
        response = requests.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {
                "ENDERECORUA": data.get("logradouro", ""),
                "BAIRRO": data.get("bairro", ""),
                "ENDERECOCIDADE": data.get("localidade", ""),
                "ENDERECOESTADO": data.get("uf", ""),
            }
    except Exception:
        pass

    return {}
