<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f3; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #819d6a 0%, #6b8558 100%); padding: 36px 32px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0;">VidaPassageira</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0;">Planeje viagens inesquec&#237;veis</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="color: #333333; font-size: 20px; font-weight: 700; margin: 0 0 16px; text-align: center;">Verifique seu email</h2>

                            <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">Ol&#225;<#if user.firstName?has_content>, ${user.firstName}</#if>!</p>

                            <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">Uma conta foi criada no <strong>VidaPassageira</strong> com este endere&#231;o de email. Clique no bot&#227;o abaixo para confirmar que este email pertence a voc&#234;.</p>

                            <!-- Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="${link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #819d6a 0%, #6b8558 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 40px; border-radius: 8px;">
                                            Verificar meu email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expiration -->
                            <p style="color: #999999; font-size: 13px; text-align: center; margin: 24px 0 0;">Este link expira em ${linkExpiration} ${linkExpirationFormatter(linkExpiration)}.</p>

                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 28px 0;">

                            <!-- Fallback link -->
                            <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 0;">Se o bot&#227;o n&#227;o funcionar, copie e cole o link abaixo no seu navegador:</p>
                            <p style="color: #819d6a; font-size: 13px; word-break: break-all; margin: 8px 0 0;">${link}</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 24px 32px; border-top: 1px solid #e8e8e8; text-align: center;">
                            <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0;">Se voc&#234; n&#227;o criou esta conta, ignore este email.</p>
                            <p style="color: #bbbbbb; font-size: 12px; margin: 12px 0 0;">&copy; VidaPassageira</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
