import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
    issuer: 'http://localhost:8080/realms/VP',
    redirectUri: window.location.origin,
    clientId: 'vp-frontend',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,    
    useSilentRefresh: true, 
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
}