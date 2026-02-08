# 🚀 Deploy de Produção - VidaPassageira

## Guia para configurar e deployar na VPS

---

## 📋 Pré-requisitos na VPS

```bash
# Verificar se Docker e Docker Compose estão instalados
docker --version
docker-compose --version

# Se não estiverem, instalar:
# https://docs.docker.com/engine/install/
# https://docs.docker.com/compose/install/
```

---

## 🔧 Configuração Inicial

### 1. Clonar Repositório (ou Pull das Mudanças)

```bash
cd /home/dev
git clone https://github.com/wosh1ngton/vidapassageira.git
cd vidapassageira

# Ou, se já existe:
cd vidapassageira
git pull
```

### 2. Criar Arquivo de Ambiente de Produção

```bash
# Copiar o template
cp .env.prod.example .env.prod

# Editar com seus valores reais
nano .env.prod
```

**Valores importantes a configurar:**
- `MYSQL_ROOT_PASSWORD` - Senha forte para MySQL
- `KEYCLOAK_ADMIN_PASSWORD` - Senha do admin do Keycloak
- `KC_HOSTNAME` - Seu domínio (ex: sharedbill.com.br)
- `DEEPSEEK_API_KEY` - Sua chave da API DeepSeek
- `API_TOKENCADASTROUSUARIO` - Token seguro para cadastro

### 3. Configurar Nginx SSL (Certificados HTTPS)

```bash
# Copiar template de configuração Nginx com SSL
cp frontend/nginx/default.conf.prod.example frontend/nginx/default.conf

# Editar e ajustar domínio
nano frontend/nginx/default.conf
```

**Certbot (Let's Encrypt) - Se ainda não tiver certificado:**

```bash
# Instalar Certbot
sudo apt install certbot

# Gerar certificado (com Nginx parado)
docker-compose -f compose.prod.yaml stop frontend
sudo certbot certonly --standalone -d sharedbill.com.br -d www.sharedbill.com.br

# Certificados serão salvos em:
# /etc/letsencrypt/live/sharedbill.com.br/fullchain.pem
# /etc/letsencrypt/live/sharedbill.com.br/privkey.pem
```

**Renovação Automática:**

```bash
# Adicionar cronjob para renovação automática
sudo crontab -e

# Adicionar linha (renova todo dia às 3am):
0 3 * * * certbot renew --quiet && docker-compose -f /home/dev/vidapassageira/compose.prod.yaml restart frontend
```

### 4. Adicionar Gitignore Local (Proteger Arquivos de Produção)

```bash
# Adicionar ao gitignore local para não sobrescrever no próximo pull
echo ".env.prod" >> .git/info/exclude
echo "compose.prod.yaml" >> .git/info/exclude
echo "frontend/nginx/default.conf" >> .git/info/exclude
```

---

## 🗄️ Preparar Banco de Dados

### Criar Database do Keycloak no MySQL

O Keycloak precisa de um banco de dados separado no MySQL:

```bash
# Iniciar apenas o MySQL primeiro
docker-compose -f compose.prod.yaml up -d mysql

# Aguardar MySQL ficar pronto (30-60 segundos)
docker-compose -f compose.prod.yaml logs -f mysql

# Quando ver "ready for connections", criar o banco do Keycloak
docker exec -it mysql mysql -uroot -p

# No prompt do MySQL, executar:
CREATE DATABASE keycloak CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EXIT;
```

**Ou via comando único:**

```bash
docker exec -it mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS keycloak CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 🚢 Deploy da Aplicação

### 1. Pull das Imagens Docker

```bash
# Login no GitHub Container Registry
docker login ghcr.io -u wosh1ngton

# Pull das imagens mais recentes
docker-compose -f compose.prod.yaml pull
```

### 2. Iniciar Todos os Serviços

```bash
# Parar containers antigos (se existirem)
docker-compose -f compose.prod.yaml down

# Iniciar todos os serviços
docker-compose -f compose.prod.yaml up -d

# Verificar logs
docker-compose -f compose.prod.yaml logs -f
```

### 3. Ordem de Inicialização (Automática via depends_on)

1. **MySQL** - Aguarda healthcheck
2. **Keycloak** - Aguarda MySQL ficar healthy
3. **Backend** - Aguarda MySQL e Keycloak
4. **Frontend** - Aguarda Backend ficar healthy

**Tempo estimado de inicialização completa:** 2-3 minutos

---

## ✅ Verificar Deploy

```bash
# Ver status de todos os containers
docker-compose -f compose.prod.yaml ps

# Todos devem estar "Up" e "healthy"

# Verificar logs individuais
docker-compose -f compose.prod.yaml logs frontend
docker-compose -f compose.prod.yaml logs backend
docker-compose -f compose.prod.yaml logs keycloak
docker-compose -f compose.prod.yaml logs mysql

# Testar endpoints
curl http://localhost/api/actuator/health
curl http://localhost:80
```

**Saídas esperadas:**
- Frontend (porta 80): HTML do Angular
- Backend health: `{"status":"UP"}`
- Keycloak: Tela de login em `http://localhost/realms/VP`

---

## 🔄 Atualizar para Nova Versão

```bash
# 1. Pull da nova versão do repositório
git pull

# 2. Pull das novas imagens Docker
docker-compose -f compose.prod.yaml pull

# 3. Restart dos serviços
docker-compose -f compose.prod.yaml down
docker-compose -f compose.prod.yaml up -d

# 4. Verificar logs
docker-compose -f compose.prod.yaml logs -f backend
```

---

## 🛠️ Comandos Úteis

### Restart de um Serviço Específico

```bash
docker-compose -f compose.prod.yaml restart backend
docker-compose -f compose.prod.yaml restart frontend
docker-compose -f compose.prod.yaml restart keycloak
```

### Ver Logs em Tempo Real

```bash
docker-compose -f compose.prod.yaml logs -f --tail=100
```

### Backup do Banco de Dados

```bash
# Backup do banco VP (aplicação)
docker exec mysql mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} vp > backup_vp_$(date +%Y%m%d).sql

# Backup do banco Keycloak
docker exec mysql mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} keycloak > backup_keycloak_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
# Restaurar banco VP
docker exec -i mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} vp < backup_vp_20260206.sql

# Restaurar banco Keycloak
docker exec -i mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} keycloak < backup_keycloak_20260206.sql
```

### Limpar Containers e Volumes (CUIDADO!)

```bash
# Parar e remover containers
docker-compose -f compose.prod.yaml down

# Remover também os volumes (APAGA BANCO DE DADOS!)
docker-compose -f compose.prod.yaml down -v

# Remover imagens antigas
docker image prune -a
```

---

## 🔒 Segurança

### Firewall (UFW)

```bash
# Permitir apenas portas necessárias
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (redireciona para HTTPS)
sudo ufw allow 443/tcp  # HTTPS (SSL/TLS)
sudo ufw enable

# Verificar status
sudo ufw status
```

### SSL/TLS (HTTPS)

Para habilitar HTTPS, recomenda-se usar:
- **Nginx Reverse Proxy** na frente do frontend
- **Certbot** para certificado Let's Encrypt

Ou:
- **Cloudflare** com SSL/TLS full (grátis)

---

## 🐛 Troubleshooting

### Keycloak não inicia

```bash
# Verificar se banco keycloak existe
docker exec -it mysql mysql -uroot -p -e "SHOW DATABASES;"

# Se não existir, criar:
docker exec -it mysql mysql -uroot -p -e "CREATE DATABASE keycloak CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Restart do Keycloak
docker-compose -f compose.prod.yaml restart keycloak
```

### Backend não conecta ao MySQL

```bash
# Verificar se MySQL está healthy
docker-compose -f compose.prod.yaml ps

# Verificar logs do backend
docker-compose -f compose.prod.yaml logs backend | grep -i "mysql\|database"

# Verificar variáveis de ambiente
docker exec backend env | grep DATABASE
```

### Frontend retorna 502 Bad Gateway

```bash
# Verificar se backend está rodando
docker-compose -f compose.prod.yaml ps backend

# Verificar health do backend
curl http://localhost:8080/actuator/health

# Verificar logs do Nginx (frontend)
docker-compose -f compose.prod.yaml logs frontend
```

### Layout do Keycloak quebrado (cache)

Ver guia completo: [TROUBLESHOOTING_KEYCLOAK.md](TROUBLESHOOTING_KEYCLOAK.md)

```bash
# Solução rápida: hard refresh no navegador
Ctrl + Shift + R

# Ou limpar cache do navegador
Ctrl + Shift + Delete
```

---

## 📊 Monitoramento

### Uso de Recursos

```bash
# Ver uso de CPU/RAM por container
docker stats

# Ver espaço em disco
df -h

# Ver tamanho dos volumes Docker
docker system df -v
```

### Logs Persistentes

```bash
# Configurar rotação de logs (adicionar ao /etc/docker/daemon.json)
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart do Docker daemon
sudo systemctl restart docker
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs: `docker-compose -f compose.prod.yaml logs -f`
2. Consultar guias:
   - [TROUBLESHOOTING_KEYCLOAK.md](TROUBLESHOOTING_KEYCLOAK.md)
   - [INFRASTRUCTURE_ANALYSIS.md](INFRASTRUCTURE_ANALYSIS.md)
3. Verificar variáveis de ambiente: `docker exec <container> env`

---

**Última atualização:** 2026-02-08
