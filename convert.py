import json

def corrigir_dataset(dados):
    lista_edicoes = []
    lista_musicas = []

    for edicao in dados.values():
        nova_edicao = {
            "_id": edicao["id"],
            "anoEdicao": edicao["anoEdição"],
            "organizacao": edicao.get("organizacao"),
            "vencedor": edicao.get("vencedor",""), 
        }

        for musica in edicao["musicas"]:
            nova_musica = {
                "_id": musica["id"],
                "link": musica["link"],
                "titulo": musica.get("título"),        
                "pais": musica.get("país"),
                "compositor": musica.get("compositor"),
                "interprete": musica.get("intérprete"), 
                "letra": musica.get("letra", ""),       
                "edicao": edicao["id"]
            }

            lista_musicas.append(nova_musica)

        lista_edicoes.append(nova_edicao)

    return lista_edicoes, lista_musicas


with open("dataset-old.json", encoding="utf-8") as f:
    dados_originais = json.load(f)


dados_edicoes, dados_musicas = corrigir_dataset(dados_originais)


with open("dataset.json", "w", encoding="utf-8") as f:
    json.dump(dados_edicoes, f, ensure_ascii=False, indent=2)


with open("musicas.json", "w", encoding="utf-8") as f:
    json.dump(dados_musicas, f, ensure_ascii=False, indent=2)


print(f"Número de edições: {len(dados_edicoes)}")
print(f"Número total de músicas: {len(dados_musicas)}")
