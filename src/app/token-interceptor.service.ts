import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TokenService} from './token.service';
import {BACKEND_URL_TOKEN} from './configuration/backend-url-token';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private tokenService: TokenService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.tokenService == null) {
      console.error('no token service');
      console.log(req);
      return next.handle(req);
    }
    if (!req.url.startsWith(this.backendUrl)) {
      return next.handle(req);
    }
    if (!this.tokenService.hasValidToken()) {
      return next.handle(req);
    }
    const token = this.tokenService.getToken();
    const authorizationHeader = `Bearer ${token}`;
    const requestClone = req.clone({
      setHeaders: {
        'Authorization': authorizationHeader,
      },
    });
    return next.handle(requestClone);
  }


}
