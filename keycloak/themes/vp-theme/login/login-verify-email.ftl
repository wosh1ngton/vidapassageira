<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Verificar Email - VidaPassageira</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />
</head>

<body class="vp-login">

<div class="login-container">
    <!-- Header com logo -->
    <div class="login-header">
        <img src="${url.resourcesPath}/img/logo.png" class="logo" alt="VidaPassageira Logo"/>
        <h1 class="login-title">Verifique seu email</h1>
        <p class="login-subtitle">Falta pouco para completar seu cadastro</p>
    </div>

    <!-- Conteúdo -->
    <div class="login-form-wrapper">
        <#if message?has_content>
            <div class="alert <#if message.type = 'success'>alert-info<#elseif message.type = 'warning'>alert-warning<#else>alert-error</#if>">
                ${message.summary}
            </div>
        </#if>

        <div class="info-content">
            <div class="info-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#819d6a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M22 4L12 13L2 4"/>
                </svg>
            </div>

            <p class="info-message">
                Enviamos um email de verificação para o seu endereço cadastrado.
                <br/><br/>
                Clique no link do email para ativar sua conta. Verifique também a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
            </p>

            <p class="verify-hint">
                Não recebeu o email?
            </p>

            <a href="${url.loginAction}" class="btn-submit info-button">
                Reenviar email de verificação
            </a>

            <div class="back-to-login">
                <a href="${url.loginUrl}" class="back-to-login-link">
                    Voltar ao login
                </a>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="login-footer">
        <p class="login-footer-text">&copy; ${.now?string('yyyy')} VidaPassageira - Planeje viagens inesquecíveis</p>
    </div>
</div>

</body>
</html>
