# VidaPassageira

Aplicacao moderna de planejamento e registro de viagens que utiliza Inteligencia Artificial para fornecer sugestoes inteligentes e personalizadas.

A plataforma ajuda viajantes a organizar itinerarios completos com recomendacoes de:

- **Onde Ficar** - Hospedagens e acomodacoes
- **Como Chegar** - Transporte e rotas
- **Onde Ir** - Atracoes e pontos turisticos
- **Onde Comer** - Restaurantes e gastronomia local

### Capturas de Tela

![Tela de Viagens](tela-viagens.jpg)

![Planejamento de Viagem com IA](planejar-viagem.jpg)

---

## Tecnologias

### Backend
- **Java 21** + **Spring Boot 3.5.2**
- **Spring Data JPA** (Hibernate)
- **Spring Security** + **OAuth2 Resource Server**
- **Spring WebFlux** (streaming SSE)
- **MySQL 8.0**
- **Flyway** (migracoes de banco)
- **MapStruct 1.5.5** (mapeamento DTO)
- **Lombok** (reducao de boilerplate)
- **Maven 3.9.6**

### Frontend
- **Angular 19.1.0** + **TypeScript 5.7.2**
- **PrimeNG 19.1.3** (componentes UI)
- **PrimeFlex 4.0.0** (CSS utilities)
- **CKEditor 5** (editor rich text)
- **ngx-markdown** (renderizacao Markdown)
- **angular-oauth2-oidc** (autenticacao)

### Infraestrutura
- **Keycloak 24.0** (autenticacao OAuth2/OIDC)
- **DeepSeek API** (IA para sugestoes de viagem)
- **Docker** + **Docker Compose**
- **Nginx** (reverse proxy)
- **GitHub Actions** (CI/CD)

---

## Arquitetura

### Backend - Arquitetura em Camadas

```
Resources (Controllers) -> Services -> Repositories -> Models
```

**Padroes de Projeto:**
- **Repository Pattern** - Spring Data JPA repositories
- **Service Layer Pattern** - Logica de negocio isolada em services
- **DTO Pattern** - Separacao entre entidades e transporte com MapStruct
- **Strategy Pattern** - Geracao de prompts IA por tipo de sugestao
- **OAuth2 Resource Server** - Validacao JWT via Keycloak

**Entidades Principais:**
- `Usuario` - Usuario vinculado ao Keycloak
- `Destino` - Destino turistico com imagem
- `Viagem` - Viagem planejada com datas
- `ItinerarioViagem` - Atividades do itinerario
- `SugestaoIA` - Sugestoes geradas por IA
- `ViagemCompartilhamento` - Compartilhamento entre usuarios

### Frontend - Componentes Standalone (Angular 19)

```
app/
├── componentes/
│   ├── home/                  # Landing page
│   ├── viagem/                # Gestao de viagens
│   │   ├── destino/           # CRUD de destinos
│   │   ├── listar-viagem/     # Lista de viagens
│   │   ├── planejar-viagem/   # Planejamento com IA
│   │   └── itinerario-viagem/ # Timeline do itinerario
│   └── usuario/               # Busca de usuarios
├── services/                  # Servicos de API
├── model/                     # Interfaces TypeScript
└── interceptors/              # Interceptors HTTP
```

### Fluxo de Autenticacao

1. Usuario acessa a aplicacao
2. Redirecionamento para Keycloak (OAuth2 Authorization Code Flow + PKCE)
3. Login no Keycloak
4. Token JWT retornado ao frontend
5. Token anexado em requisicoes API via interceptor
6. Backend valida JWT como Resource Server

### Integracao com IA

- **Streaming Server-Sent Events (SSE)** para respostas em tempo real
- **4 tipos de sugestoes** via DeepSeek API: Onde Ficar, Como Chegar, Onde Ir, Onde Comer
- Conversao de sugestoes em itinerarios estruturados
- Persistencia de sugestoes no banco de dados

---

## Pre-requisitos

- **Java 21** ou superior
- **Node.js 20+** e npm
- **Docker** e **Docker Compose**
- **MySQL 8.0** (ou via Docker)
- **Keycloak 24.0** (ou via Docker)
- Chave de API **DeepSeek**

---

## Configuracao

### 1. Variaveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
# Database
DATABASE_URL=jdbc:mysql://mysql:3306/vidapassageira
DATABASE_USERNAME=root
DATABASE_PASSWORD=sua_senha

# Keycloak
KEYCLOAK_CLIENT_ID=vp-backend
KEYCLOAK_USERNAME=admin
KEYCLOAK_PASSWORD=admin

# DeepSeek AI
DEEPSEEK_API_KEY=sua_chave_api
```

### 2. Instalacao Local (Desenvolvimento)

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
API disponivel em: `http://localhost:8080/api`

#### Frontend
```bash
cd frontend
npm install
ng serve
```
Aplicacao disponivel em: `http://localhost:4600`

#### Keycloak
```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:24.0 start-dev
```
Importar realm de desenvolvimento: `keycloak/realm-dev/`

### 3. Deploy com Docker Compose

```bash
# Construir e iniciar todos os servicos
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar servicos
docker-compose down
```

**Servicos:**
| Servico | URL | Porta |
|---------|-----|-------|
| Frontend | `http://localhost` | 80 |
| Backend API | `http://localhost/api` | 8080 (interno) |
| Keycloak | `http://localhost/realms/VP` | 8080 (interno) |
| MySQL | `localhost:3306` | 3306 |

---

## Endpoints da API

### Autenticacao
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registro de usuario |

### Viagens
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/viagens` | Listar viagens do usuario |
| POST | `/api/viagens` | Criar viagem |
| PUT | `/api/viagens` | Atualizar viagem |
| DELETE | `/api/viagens/{id}` | Deletar viagem |

### Destinos
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/destinos` | Listar destinos |
| POST | `/api/destinos` | Criar destino |
| PUT | `/api/destinos` | Atualizar destino |
| DELETE | `/api/destinos/{id}` | Deletar destino |

### Itinerario
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/viagens/itinerario` | Adicionar item ao itinerario |
| GET | `/api/viagens/itinerario/{id}` | Listar itinerario da viagem |
| DELETE | `/api/viagens/itinerario/{id}` | Deletar item do itinerario |
| PUT | `/api/viagens/itinerario/{id}/concluir` | Marcar item como concluido |

### IA (Planejamento)
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/planejamento-ia/gerar-async` | Gerar sugestao via streaming (SSE) |

### Sugestoes IA
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/sugestao-ia` | Salvar sugestao da IA |
| GET | `/api/sugestao-ia/{id}` | Buscar sugestoes de uma viagem |
| DELETE | `/api/sugestao-ia/{id}` | Deletar sugestao |

### Compartilhamento
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/compartilhamento` | Compartilhar viagem |
| DELETE | `/api/compartilhamento/{id}` | Remover compartilhamento |

### Usuarios
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/usuarios` | Buscar usuarios |

---

## Schema do Banco de Dados

**Tabelas Principais:**

```
usuario ──1:N──> viagem ──1:N──> itinerario_viagem
   │                │
   │                └──1:N──> sugestao_ia ──N:1──> tipo_sugestao_ia
   │                │
   └────1:N────> viagem_compartilhamento ──N:1──> viagem

destino ──1:N──> viagem
```

**Migracoes Flyway:** `backend/src/main/resources/db/migration/`

---

## Build para Producao

### Backend
```bash
cd backend
mvn clean package -DskipTests
# JAR gerado em: target/backend-*.jar
```

### Frontend
```bash
cd frontend
ng build --configuration production
# Build gerado em: dist/frontend/browser
```

### Docker Images
```bash
# Backend
docker build -f backend/Dockerfile.prod -t vp-backend:latest .

# Frontend
docker build -f frontend/Dockerfile.prod -t vp-frontend:latest .
```

---

## CI/CD

Pipeline GitHub Actions configurado em `.github/workflows/docker.yml`:
- Build automatico no push para `main`
- Construcao de imagens Docker multi-stage
- Push para GitHub Container Registry (`ghcr.io/wosh1ngton/`)

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudancas (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## Suporte

Para questoes e suporte, abra uma issue no GitHub.
