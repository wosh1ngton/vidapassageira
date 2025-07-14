import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
    issuer: 'http://localhost:8080/realms/VP',
    redirectUri: window.location.origin,
    clientId: 'vp-frontend',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,    
    useSilentRefresh: false,    
    timeoutFactor: 0.75,
    clearHashAfterLogin: false,
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',    
    strictDiscoveryDocumentValidation: false,
    skipIssuerCheck: true
}