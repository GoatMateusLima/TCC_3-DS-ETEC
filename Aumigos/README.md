# TCC_3-DS-ETEC
Projeto De TCC


Estrutura que desejo seguir:


aumigos/
│
├── frontend/
│   ├── public/                 # Arquivos estáticos (index.html, favicon, imagens públicas)
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── img/
│   │       └── ...
│   │
│   ├── src/                    # Código-fonte do front
│   │   ├── assets/             # Imagens, fontes, vídeos usados no projeto
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── pages/              # Páginas completas (Home, ONG, Adotar, etc.)
│   │   ├── services/           # Conexões com o back-end (requisições fetch/axios)
│   │   ├── styles/             # CSS ou arquivos SASS/SCSS
│   │   ├── utils/              # Funções utilitárias
│   │   └── main.js             # Arquivo principal JS (ou App.js, index.js)
│   │
│   └── package.json            # Dependências do front (caso use npm, vite, etc.)
│
├── backend/
│   ├── controllers/            # Lógica dos dados (ex: cadastrar ONG, listar pets)
│   ├── models/                 # Modelos do banco de dados (ex: Usuario, Pet, ONG)
│   ├── routes/                 # Rotas da aplicação (ex: /login, /ongs)
│   ├── database/               # Conexão com banco (ex: MySQL, SQLite)
│   ├── middlewares/           # Autenticação, validação, etc.
│   ├── public/                 # Se precisar servir arquivos estáticos pelo back
│   ├── uploads/                # Imagens enviadas (upload de perfil, pets, etc)
│   ├── app.js                  # App principal (Express ou outro framework)
│   └── package.json            # Dependências do back (caso use npm)
│
├── docs/                      # Documentação do projeto (PDF, wireframes, API, etc)
│
├── README.md
└── .gitignore

APENAS TESTE