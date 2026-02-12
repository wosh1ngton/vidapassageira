# Configurações do Keycloak para Produção

## Problema
O link de registro está direcionando para `localhost` ao invés do domínio de produção `vidapassageira.com.br`.

## Causa
O **client `vp-frontend` no Keycloak** está configurado com apenas `localhost` como Valid Redirect URI.

## Solução

### Passo 1: Acessar Admin Console do Keycloak

1. Acesse: `https://vidapassageira.com.br/admin`
2. Faça login com credenciais de administrador
3. Selecione o realm **VP**

### Passo 2: Configurar Valid Redirect URIs

1. No menu lateral, clique em **Clients**
2. Encontre e clique no client **`vp-frontend`**
3. Na aba **Settings**, role até a seção **Access settings**
4. Localize o campo **Valid redirect URIs**
5. Adicione as seguintes URIs (uma por linha):

```
https://vidapassageira.com.br/*
https://www.vidapassageira.com.br/*
http://localhost:4600/*
```

6. Localize o campo **Valid post logout redirect URIs**
7. Adicione as mesmas URIs:

```
https://vidapassageira.com.br/*
https://www.vidapassageira.com.br/*
http://localhost:4600/*
```

8. Localize o campo **Web origins**
9. Adicione:

```
https://vidapassageira.com.br
https://www.vidapassageira.com.br
http://localhost:4600
```

10. Clique em **Save** no final da página

### Passo 3: Verificar Outras Configurações

Certifique-se de que as seguintes opções estão configuradas:

#### General Settings:
- **Client ID**: `vp-frontend`
- **Name**: `VidaPassageira Frontend`
- **Client authentication**: OFF (aplicação pública)
- **Authorization**: OFF

#### Capability config:
- **Standard flow**: ✅ Enabled (Authorization Code Flow)
- **Direct access grants**: ❌ Disabled
- **Implicit flow**: ❌ Disabled

#### Login settings:
- **Root URL**: `https://vidapassageira.com.br`
- **Home URL**: `https://vidapassageira.com.br`

### Passo 4: Testar

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Acesse `https://vidapassageira.com.br`
3. Clique em "Criar conta"
4. Complete o registro
5. Após salvar, deve redirecionar para a página de login do Keycloak no domínio correto

---

## Alternativa: Via Linha de Comando (VPS)

Se preferir configurar via CLI usando `kcadm.sh`:

```bash
# Entrar no container do Keycloak
docker exec -it keycloak bash

# Fazer login no kcadm
/opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 \
  --realm master \
  --user admin \
  --password <senha-admin>

# Atualizar o client
/opt/keycloak/bin/kcadm.sh update clients/<CLIENT_UUID> \
  -r VP \
  -s 'redirectUris=["https://vidapassageira.com.br/*","https://www.vidapassageira.com.br/*","http://localhost:4600/*"]' \
  -s 'webOrigins=["https://vidapassageira.com.br","https://www.vidapassageira.com.br","http://localhost:4600"]' \
  -s 'postLogoutRedirectUris=["https://vidapassageira.com.br/*","https://www.vidapassageira.com.br/*","http://localhost:4600/*"]'
```

**Nota**: Substitua `<CLIENT_UUID>` pelo ID do client. Para descobrir:

```bash
/opt/keycloak/bin/kcadm.sh get clients -r VP --fields id,clientId | grep -A1 "vp-frontend"
```

---

## Verificação

Após aplicar as mudanças, verifique:

1. ✅ O registro redireciona para `https://vidapassageira.com.br` (não localhost)
2. ✅ O login funciona corretamente
3. ✅ O logout funciona corretamente

---

---

## Configurar SMTP para Recuperacao de Senha

Para que a funcionalidade "Esqueci minha senha" funcione, o Keycloak precisa enviar emails. Configure o SMTP via Admin Console:

### Passo 1: Acessar Configuracao de Email

1. Acesse: `https://vidapassageira.com.br/admin`
2. Selecione o realm **VP**
3. No menu lateral, clique em **Realm settings**
4. Clique na aba **Email**

### Passo 2: Configurar SMTP

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **From** | `noreply@seudominio.com` |
| **From display name** | `VidaPassageira` |
| **Reply to** | `suporte@seudominio.com` (opcional) |
| **Host** | Endereco do servidor SMTP |
| **Port** | `587` (TLS) ou `465` (SSL) |
| **Enable SSL** | Marcar se porta 465 |
| **Enable StartTLS** | Marcar se porta 587 |
| **Enable authentication** | Marcar |
| **Username** | Seu usuario SMTP |
| **Password** | Sua senha SMTP |

### Passo 3: Testar

1. Clique em **Test connection** para verificar se o email funciona
2. Verifique a caixa de entrada do email configurado em "From"

### Passo 4: Habilitar Reset de Senha

1. No menu lateral, clique em **Realm settings**
2. Clique na aba **Login**
3. Habilite **Forgot password** (toggle ON)
4. Clique em **Save**

### Exemplos de Configuracao SMTP

#### Provedor Generico
```
Host: smtp.seudominio.com
Port: 587
StartTLS: true
Auth: true
Username: noreply@seudominio.com
Password: sua-senha
```

#### Gmail (App Password)
```
Host: smtp.gmail.com
Port: 587
StartTLS: true
Auth: true
Username: seuemail@gmail.com
Password: app-password-16-chars
```

#### Amazon SES
```
Host: email-smtp.us-east-1.amazonaws.com
Port: 587
StartTLS: true
Auth: true
Username: AKIAIOSFODNN7EXAMPLE
Password: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

## Referências

- [Keycloak Client Configuration](https://www.keycloak.org/docs/latest/server_admin/#client-configuration)
- [Keycloak Email Configuration](https://www.keycloak.org/docs/latest/server_admin/#_email)
- [OAuth 2.0 Redirect URI](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1.2)
