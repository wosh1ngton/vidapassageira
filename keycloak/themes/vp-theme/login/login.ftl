<!DOCTYPE html>
<html class="${properties.kcHtmlClass!}">
<head>
    <meta charset="utf-8">
    <title>${msg("loginTitle")}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet"
          href="${url.resourcesPath}/css/login.css" />
</head>

<body class="vp-login">

<div class="login-container">
    <img src="${url.resourcesPath}/img/logo.png" class="logo"/>  

    <form id="kc-form-login"
          action="${url.loginAction}"
          method="post">

        <input type="text"
               name="username"
               placeholder="Email"
               autofocus />

        <input type="password"
               name="password"
               placeholder="Password" />

        <button type="submit">
            Entrar
        </button>
    </form>
    

    <#if message?has_content>
        <div class="error">
            ${message.summary}
        </div>
    </#if>
</div>

</body>
</html>
