# Projeto EngWeb2025 - Normal 2025

## Persistência de dados

Foi utilizado o MongoDB como sistema de base de dados para persistir a informação relativa às edições do Festival da Eurovisão.

O dataset original foi dividido em duas coleções:
- `edicoes`: contém os dados principais de cada edição (id, ano, país organizador e país vencedor);
- `musicas`: contém os dados das músicas associadas a cada edição.

## Setup de bases de dados

Foi aplicado um script Python(`convert.py`) para processar e separar o dataset original:
- Dividiu-se o ficheiro inicial em dois ficheiros: um para as edições (`edicoes.json`) e outro para as músicas (`musicas.json`);
- Normalizaram-se os nomes dos campos, removendo acentos (ex: `anoEdição` → `anoEdicao`, `intérprete` → `interprete`);
- Havia entradas em que não existia informação sobre o venceor, então foi adicionada uma string vazia para manter a consistência dos dados;
- Garantiu-se que os ficheiros resultantes estavam no formato correto para importação via `mongoimport`.

## Resultado

Importação bem-sucedida das duas coleções:
- Base de dados: `eurovisao`
- Coleções: `edicoes`, `musicas`

## Exercício 1 - Implementação do Backend

Para responder às questões propostas, desenvolveu-se uma API REST no backend (porta `25000`) utilizando Express e Mongoose.

A API disponibiliza os seguintes endpoints principais:

- `GET /edicoes`: devolve todas as edições, com opção de filtro por país organizador;
- `GET /edicoes/:id`: devolve os detalhes de uma edição específica, incluindo a lista de músicas associadas;
- `GET /paises?papel=org`: devolve todos os países que organizaram edições e respetivos anos;
- `GET /paises?papel=venc`: devolve todos os países que venceram edições e respetivos anos;
- `GET /edicoes/musicas`: devolve todas as músicas (para estatísticas e análise);
- `GET /interpretes`: devolve a lista de intérpretes únicos, agrupados por país;
- `POST /edicoes`: cria uma nova edição (com ou sem músicas);
- `PUT /edicoes/:id`: atualiza uma edição e substitui as músicas associadas;
- `DELETE /edicoes/:id`: remove uma edição e as suas músicas.

Todos os testes realizados às rotas encontram-se no ficheiro `ex1/queriespostman.json`, disponível no repositório.

## Exercício 2

Durante a implementação do frontend e da visualização dos dados:

- Foi criada uma nova rota no backend (`GET /edicoes/musicas`) com o objetivo de simplificar o acesso à lista de todas as músicas da base de dados, facilitando a lógica de renderização da página de cada país e de estatísticas.
- Esta rota permitiu que o frontend acedesse diretamente à coleção de músicas, evitando a necessidade de fazer múltiplas chamadas por edição.

## Instruções de execução

```bash
docker compose up --build
```

Após isso:
- Aceder a `http://localhost:25001` para o frontend
- Aceder a `http://localhost:25000` para a API

## Ações necessárias

- Separação do dataset em dois ficheiros com Python
- Remoção de acentos e formatação dos dados
- Importação via:

```bash
mongoimport --host mongodb -d eurovisao -c edicoes --file edicoes.json --jsonArray
mongoimport --host mongodb -d eurovisao -c musicas --file musicas.json --jsonArray
```