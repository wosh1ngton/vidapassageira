<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Login - VidaPassageira</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />
</head>

<body class="vp-login">

<div class="login-container">
    <!-- Header com logo e título -->
    <div class="login-header">
        <img src="${url.resourcesPath}/img/logo.png" class="logo" alt="VidaPassageira Logo"/>
        <h1 class="login-title">Bem-vindo de volta!</h1>
        <p class="login-subtitle">Planeje suas próximas aventuras</p>
    </div>

    <!-- Formulário de login -->
    <div class="login-form-wrapper">
        <#if message?has_content>
            <div class="alert <#if message.type = 'success'>alert-info<#elseif message.type = 'warning'>alert-warning<#else>alert-error</#if>">
                ${message.summary}
            </div>
        </#if>

        <form id="kc-form-login" action="${url.loginAction}" method="post">
            <div class="form-group">
                <label for="username">Email ou usuário</label>
                <input
                    id="username"
                    class="form-input"
                    type="text"
                    name="username"
                    placeholder="Digite seu email"
                    autocomplete="username"
                    autofocus
                    required />
            </div>

            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    id="password"
                    class="form-input"
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    autocomplete="current-password"
                    required />
            </div>

            <div class="forgot-password">
                <a href="${url.loginResetCredentialsUrl}" class="forgot-password-link">
                    Esqueci minha senha
                </a>
            </div>

            <button type="submit" class="btn-submit">
                Entrar
            </button>
        </form>

        <div class="register-link-container">
            <p class="register-text">Ainda não tem uma conta?</p>
            <#assign appUrl = (client.rootUrl)!''>
            <#if !(appUrl?has_content)>
                <#assign appUrl = url.loginUrl?keep_before('/realms/')>
            </#if>
            <a href="${appUrl}/registro" class="register-link">
                Criar conta grátis
            </a>
        </div>
    </div>

    <!-- Footer -->
    <div class="login-footer">
        <p class="login-footer-text">© ${.now?string('yyyy')} VidaPassageira - Planeje viagens inesquecíveis</p>
    </div>
</div>

</body>
</html>
