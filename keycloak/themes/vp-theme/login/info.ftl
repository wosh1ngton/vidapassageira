<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Informação - VidaPassageira</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />
</head>

<body class="vp-login">

<div class="login-container">
    <!-- Header com logo -->
    <div class="login-header">
        <img src="${url.resourcesPath}/img/logo.png" class="logo" alt="VidaPassageira Logo"/>
        <h1 class="login-title">${message.summary}</h1>
    </div>

    <!-- Conteúdo informativo -->
    <div class="login-form-wrapper">
        <div class="info-content">
            <div class="info-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#819d6a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>

            <#if requiredActions??>
                <p class="info-message">
                    <#list requiredActions as reqActionItem>
                        ${kcSanitize(msg("requiredAction.${reqActionItem}"))?no_esc}
                        <#sep>, </#sep>
                    </#list>
                </p>
            </#if>

            <#if skipLink??>
            <#else>
                <#if pageRedirectUri?has_content>
                    <a href="${pageRedirectUri}" class="btn-submit info-button">
                        Continuar
                    </a>
                <#elseif actionUri?has_content>
                    <a href="${actionUri}" class="btn-submit info-button">
                        Continuar
                    </a>
                <#elseif (client.baseUrl)?has_content>
                    <a href="${client.baseUrl}" class="btn-submit info-button">
                        Voltar ao site
                    </a>
                <#else>
                    <#assign appUrl = (client.rootUrl)!''>
                    <#if !(appUrl?has_content)>
                        <#assign appUrl = url.loginUrl?keep_before('/realms/')>
                    </#if>
                    <a href="${appUrl}" class="btn-submit info-button">
                        Voltar ao site
                    </a>
                </#if>
            </#if>

            <div class="back-to-login">
                <a href="${url.loginUrl}" class="back-to-login-link">
                    Ir para o login
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
