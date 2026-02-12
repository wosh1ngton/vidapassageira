<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Recuperar Senha - VidaPassageira</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />
</head>

<body class="vp-login">

<div class="login-container">
    <!-- Header com logo e título -->
    <div class="login-header">
        <img src="${url.resourcesPath}/img/logo.png" class="logo" alt="VidaPassageira Logo"/>
        <h1 class="login-title">Recuperar senha</h1>
        <p class="login-subtitle">Informe seu email para receber o link de recuperação</p>
    </div>

    <!-- Formulário de recuperação -->
    <div class="login-form-wrapper">
        <#if message?has_content>
            <div class="alert <#if message.type = 'success'>alert-info<#elseif message.type = 'warning'>alert-warning<#else>alert-error</#if>">
                ${message.summary}
            </div>
        </#if>

        <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
            <div class="form-group">
                <label for="username">Email ou usuário</label>
                <input
                    id="username"
                    class="form-input"
                    type="text"
                    name="username"
                    placeholder="Digite seu email cadastrado"
                    autocomplete="username"
                    autofocus
                    required />
            </div>

            <button type="submit" class="btn-submit">
                Enviar link de recuperação
            </button>
        </form>

        <div class="back-to-login">
            <a href="${url.loginUrl}" class="back-to-login-link">
                ← Voltar ao login
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
