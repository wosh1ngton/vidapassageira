# Correção: Redirect URI do Keycloak para Produção

## Problema
O link de registro está direcionando para `localhost` ao invés do domínio de produção `sharedbill.com.br`.

## Causa
O **client `vp-frontend` no Keycloak** está configurado com apenas `localhost` como Valid Redirect URI.

## Solução

### Passo 1: Acessar Admin Console do Keycloak

1. Acesse: `https://sharedbill.com.br/admin`
2. Faça login com credenciais de administrador
3. Selecione o realm **VP**

### Passo 2: Configurar Valid Redirect URIs

1. No menu lateral, clique em **Clients**
2. Encontre e clique no client **`vp-frontend`**
3. Na aba **Settings**, role até a seção **Access settings**
4. Localize o campo **Valid redirect URIs**
5. Adicione as seguintes URIs (uma por linha):

```
https://sharedbill.com.br/*
https://www.sharedbill.com.br/*
http://localhost:4600/*
```

6. Localize o campo **Valid post logout redirect URIs**
7. Adicione as mesmas URIs:

```
https://sharedbill.com.br/*
https://www.sharedbill.com.br/*
http://localhost:4600/*
```

8. Localize o campo **Web origins**
9. Adicione:

```
https://sharedbill.com.br
https://www.sharedbill.com.br
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
- **Root URL**: `https://sharedbill.com.br`
- **Home URL**: `https://sharedbill.com.br`

### Passo 4: Testar

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Acesse `https://sharedbill.com.br`
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
  -s 'redirectUris=["https://sharedbill.com.br/*","https://www.sharedbill.com.br/*","http://localhost:4600/*"]' \
  -s 'webOrigins=["https://sharedbill.com.br","https://www.sharedbill.com.br","http://localhost:4600"]' \
  -s 'postLogoutRedirectUris=["https://sharedbill.com.br/*","https://www.sharedbill.com.br/*","http://localhost:4600/*"]'
```

**Nota**: Substitua `<CLIENT_UUID>` pelo ID do client. Para descobrir:

```bash
/opt/keycloak/bin/kcadm.sh get clients -r VP --fields id,clientId | grep -A1 "vp-frontend"
```

---

## Verificação

Após aplicar as mudanças, verifique:

1. ✅ O registro redireciona para `https://sharedbill.com.br` (não localhost)
2. ✅ O login funciona corretamente
3. ✅ O logout funciona corretamente

---

## Referências

- [Keycloak Client Configuration](https://www.keycloak.org/docs/latest/server_admin/#client-configuration)
- [OAuth 2.0 Redirect URI](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1.2)
