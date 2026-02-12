<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Nova Senha - VidaPassageira</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />
</head>

<body class="vp-login">

<div class="login-container">
    <!-- Header com logo e título -->
    <div class="login-header">
        <img src="${url.resourcesPath}/img/logo.png" class="logo" alt="VidaPassageira Logo"/>
        <h1 class="login-title">Redefinir senha</h1>
        <p class="login-subtitle">Crie uma nova senha para sua conta</p>
    </div>

    <!-- Formulário de nova senha -->
    <div class="login-form-wrapper">
        <#if message?has_content>
            <div class="alert <#if message.type = 'success'>alert-info<#elseif message.type = 'warning'>alert-warning<#else>alert-error</#if>">
                ${message.summary}
            </div>
        </#if>

        <form id="kc-passwd-update-form" action="${url.loginAction}" method="post">
            <input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly="readonly" style="display:none;"/>

            <div class="form-group">
                <label for="password-new">Nova senha</label>
                <input
                    id="password-new"
                    class="form-input"
                    type="password"
                    name="password-new"
                    placeholder="Digite sua nova senha"
                    autocomplete="new-password"
                    autofocus
                    required />
            </div>

            <div class="form-group">
                <label for="password-confirm">Confirmar nova senha</label>
                <input
                    id="password-confirm"
                    class="form-input"
                    type="password"
                    name="password-confirm"
                    placeholder="Confirme sua nova senha"
                    autocomplete="new-password"
                    required />
            </div>

            <button type="submit" class="btn-submit">
                Redefinir senha
            </button>
        </form>

        <#if isAppInitiatedAction??>
            <div class="back-to-login">
                <form id="kc-cancel-form" action="${url.loginAction}" method="post">
                    <input type="hidden" name="cancel-aia" value="true" />
                    <button type="submit" class="back-to-login-link btn-link">
                        Cancelar
                    </button>
                </form>
            </div>
        </#if>
    </div>

    <!-- Footer -->
    <div class="login-footer">
        <p class="login-footer-text">© ${.now?string('yyyy')} VidaPassageira - Planeje viagens inesquecíveis</p>
    </div>
</div>

</body>
</html>
