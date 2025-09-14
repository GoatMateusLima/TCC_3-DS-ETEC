backend/
│
├── src/
│   ├── server.js             # ponto de entrada (sobe o servidor)
│   ├── routes/               # define endpoints
│   │   └── cnpjRoutes.js
│   ├── controllers/          # lógica das rotas
│   │   └── cnpjController.js
│   ├── services/             # integrações externas (API, banco)
│   │   └── brasilApi.js
│   ├── utils/                # funções auxiliares
│   │   └── validarCnpj.js
│   ├── config/               # configurações (ex.: banco, variáveis de ambiente)
│   │   └── db.js             # arquivo de conexão com banco
│   ├── middlewares/          # segurança e regras de request
│   │   └── authMiddleware.js # exemplo: autenticação
│   └── security/             # configs de proteção extra
│       └── corsConfig.js     # exemplo: liberar/domínios do front
│
└── package.json



server.js → inicializa o Express, carrega middlewares globais, conecta no banco, e registra as rotas.

routes/ → define as URLs (GET/POST etc.).

controllers/ → recebe a requisição, valida dados, chama o service e responde.

services/ → chama APIs externas (BrasilAPI) ou banco.

utils/ → pequenas funções de apoio (ex.: validar CNPJ).

config/ → configurações (banco, variáveis de ambiente).

middlewares/ → funções que rodam antes da rota (autenticação, logs, etc.).

security/ → proteção (CORS, helmet, rate limiting, etc.).
