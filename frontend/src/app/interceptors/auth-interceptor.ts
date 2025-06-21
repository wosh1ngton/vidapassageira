import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private oauthService: OAuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.oauthService.getAccessToken();

        if(accessToken) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            return next.handle(cloned);
        }

        return next.handle(req);
    }
}