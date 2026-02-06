# VidaPassageira - Referencia Tecnica

> Documentacao tecnica para desenvolvedores e assistentes de IA trabalhando no projeto.

## Status do Projeto

**Versao:** 1.0.0
**Status:** Funcional - Em Producao
**Ultima atualizacao:** 2026-02-06

### Estado Atual
- Backend API completo e funcional
- Frontend com todas as features principais
- Autenticacao OAuth2 via Keycloak funcionando
- Integracao com IA (DeepSeek) implementada com streaming SSE
- Docker Compose configurado para deploy
- CI/CD pipeline ativo (GitHub Actions)
- Compartilhamento de viagens entre usuarios

---

## Stack Tecnologico

**Backend:** Java 21 + Spring Boot 3.5.2 + Spring Data JPA + Spring WebFlux + Spring Security OAuth2 + MySQL 8.0 + Flyway + MapStruct 1.5.5 + Lombok

**Frontend:** Angular 19.1.0 + TypeScript 5.7.2 + PrimeNG 19.1.3 + PrimeFlex 4.0.0 + CKEditor 5 + angular-oauth2-oidc + ngx-markdown

**Infra:** Keycloak 24.0 + DeepSeek API + Docker + Nginx + GitHub Container Registry

---

## Arquitetura

### Backend - Layered Architecture

```
Resources (@RestController) -> Services (@Service) -> Repositories (JpaRepository) -> Models (@Entity)
```

**Padroes Implementados:**
1. **Repository Pattern** - Spring Data JPA repositories com query methods
2. **Service Layer** - Logica de negocio isolada
3. **DTO Pattern** - Separacao entidade/transporte com MapStruct
4. **Mapper Pattern** - MapStruct para conversoes automaticas
5. **Strategy Pattern** - Geracao de prompts IA por tipo (SugestaoIAService)
6. **OAuth2 Resource Server** - Validacao JWT via Keycloak

### Frontend - Component-Based Architecture

**Padroes:**
1. **Standalone Components** (Angular 19)
2. **Service Layer** para comunicacao com API
3. **Abstract Base Service** para CRUD operations
4. **Dialog-based Forms** via PrimeNG DynamicDialog
5. **Reactive Streams** com RxJS

---

## Estrutura de Pacotes

### Backend

```
br.com.vidapassageira.backend/
├── config/           # SecurityConfig, CorsConfig, DeepSeekConfig
├── dtos/             # DTOs organizados por dominio (viagem/, destino/, ia/, etc.)
├── exceptions/       # EntityNotFoundException, SugestaoDuplicadaException
├── mappers/          # MapStruct mappers (ViagemMapper, DestinoMapper, etc.)
├── models/           # JPA Entities (Usuario, Viagem, Destino, etc.)
│   └── enums/        # TipoSugestaoEnum
├── repositories/     # Spring Data JPA repositories
├── resources/        # REST Controllers + GlobalExceptionHandler
└── services/         # Business logic (ViagensService, IAService, etc.)
```

### Frontend

```
src/app/
├── componentes/
│   ├── home/                    # Landing page
│   ├── viagem/
│   │   ├── destino/             # form-destino/ + listar-destino/
│   │   ├── form-viagem/         # Dialog form de viagem
│   │   ├── listar-viagem/       # Cards de viagens
│   │   ├── planejar-viagem/     # Planejamento com IA + sugestao-ia/
│   │   └── itinerario-viagem/   # Timeline PrimeNG
│   ├── usuario/usuario-busca/   # Busca e compartilhamento
│   └── shared/                  # ck-editor/, page-not-found/
├── services/                    # abstract-entity.service.ts + servicos de dominio
├── model/                       # Interfaces TypeScript
├── interceptors/                # http.interceptor.ts
└── shared/util/                 # conversores.ts (Base64, Markdown)
```

---

## Modelo de Dados

### Entidades e Relacionamentos

```
Usuario (id, userName, email, keyCloakId)
   |-- 1:N --> Viagem (id, destino, dataIda, dataVolta, usuario)
   |               |-- 1:N --> ItinerarioViagem (id, nome, descricao, orcamento, duracao, categoria, dia, melhorHorario, itinerarioConcluido)
   |               |-- 1:N --> SugestaoIA (id, sugestao, tipoSugestaoIA, viagem)
   |               +-- 1:N --> ViagemCompartilhamento (id, viagem, usuario)
   +-- 1:N --> ViagemCompartilhamento

Destino (id, nome, localizacao, descricao, imagem[BLOB]) --1:N--> Viagem
TipoSugestaoIA (id, nomeTipo, categoria[ENUM]) --1:N--> SugestaoIA
```

### Enums
- `TipoSugestaoEnum`: ONDE_FICAR, COMO_CHEGAR, ONDE_IR, ONDE_COMER

---

## Endpoints da API

### Publicos (sem autenticacao)
- `GET /api/planejamento-ia/gerar-async` - Streaming IA (SSE)
- `POST /api/auth/register` - Registro
- `GET /actuator/health` - Health check

### Protegidos (requer JWT)
- `/api/viagens/**` - CRUD viagens + itinerario
- `/api/destinos/**` - CRUD destinos
- `/api/sugestao-ia/**` - Sugestoes IA
- `/api/compartilhamento/**` - Compartilhamento
- `/api/usuarios/**` - Busca usuarios

---

## Autenticacao

### Fluxo OAuth2 (Authorization Code + PKCE)

```
Frontend -> Keycloak login -> JWT token -> Interceptor adiciona Bearer -> Backend valida como Resource Server
```

### Extrair usuario autenticado (Backend)

```java
@AuthenticationPrincipal Jwt jwt
String keycloakId = jwt.getSubject();
```

### Configuracao de seguranca
- Arquivo: `backend/src/main/java/br/com/vidapassageira/backend/config/SecurityConfig.java`
- CSRF desabilitado
- OAuth2 Resource Server com JWT

---

## Integracao IA (DeepSeek)

### Streaming SSE

```java
// IAService.java - WebClient reativo
webClient.post().uri("/chat/completions")
    .bodyValue(requestBody)
    .retrieve()
    .bodyToFlux(String.class)  // SSE streaming
```

### Strategy Pattern para Prompts

```java
// SugestaoIAService.java
Map<TipoSugestaoEnum, Function<ViagemResponseDTO, String>> IA_PROMPTS = Map.of(
    ONDE_IR, dto -> "Voce e um guia turistico...",
    ONDE_FICAR, dto -> "Voce e um especialista em hospedagens...",
    COMO_CHEGAR, dto -> "Voce e um especialista em transporte...",
    ONDE_COMER, dto -> "Voce e um critico gastronomico..."
);
```

---

## Configuracoes

### Backend - application.yml
- `spring.datasource.url` = `${DATABASE_URL}`
- `spring.jpa.hibernate.ddl-auto` = `none` (Flyway gerencia schema)
- `spring.flyway.enabled` = `true`
- `deepseek.api.url` = `https://api.deepseek.com/v1`
- `deepseek.api.key` = `${DEEPSEEK_API_KEY}`

### Frontend - Environments
- **Dev:** `localhost:8070` (backend), `localhost:8080` (keycloak)
- **Docker:** `/api` (nginx proxy), `/realms/VP` (keycloak proxy)
- **Prod:** URLs de producao

### Nginx (frontend/nginx/default.conf)
- `/` -> Angular SPA (try_files)
- `/api/` -> Backend (proxy_pass)
- `/realms/` -> Keycloak (proxy_pass)

---

## Tema Visual

```css
:root {
    --cor-primaria: #819d6a;    /* sage green */
    --cor-secundaria: antiquewhite;
    --font-primaria: sans-serif;
}
```

UI Library: PrimeNG com preset Lara customizado

---

## Tarefas Comuns

### Adicionar nova entidade
1. Criar `@Entity` em `models/`
2. Criar `JpaRepository` em `repositories/`
3. Criar DTOs (Create + Response) em `dtos/`
4. Criar `@Mapper` MapStruct em `mappers/`
5. Criar `@Service` em `services/`
6. Criar `@RestController` em `resources/`
7. Criar migration Flyway em `db/migration/V{N}__descricao.sql`
8. Frontend: interface em `model/`, service em `services/`, componente em `componentes/`

### Adicionar migration
- Criar em `backend/src/main/resources/db/migration/`
- Nomenclatura: `V{numero}__descricao.sql`
- Flyway aplica automaticamente no startup

### Build e deploy
```bash
# Dev local
cd backend && mvn spring-boot:run
cd frontend && ng serve

# Docker
docker-compose up -d --build

# CI/CD: push para main dispara build automatico
```

---

## Proximas Melhorias Sugeridas

### Alta Prioridade
- Adicionar documentacao OpenAPI/Swagger
- Implementar empty states em listas
- Adicionar testes unitarios e E2E

### Media Prioridade
- Loading indicators durante geracao IA
- Filtros e busca em listas de viagens/destinos
- Otimizar imagens (CDN ao inves de BLOB)

### Baixa Prioridade
- Lazy loading de rotas Angular
- Dark mode
- Exportar itinerario (PDF)
- Internacionalizacao (i18n)
