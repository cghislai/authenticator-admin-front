import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TokenService} from './token.service';
import {BACKEND_URL_TOKEN} from './configuration/backend-url-token';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private tokenService: TokenService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.backendUrl)) {
      return this.handleResponse(next, req);
    }
    if (!this.tokenService.hasValidToken()) {
      return this.handleResponse(next, req);
    }
    const token = this.tokenService.getToken();
    const authorizationHeader = `Bearer ${token}`;
    const requestClone = req.clone({
      setHeaders: {
        'Authorization': authorizationHeader,
      },
    });
    return this.handleResponse(next, requestClone);
  }


  private handleResponse(next: HttpHandler, req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => this.handleHttpError(error)),
    );
  }

  private handleHttpError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.tokenService.clearToken();
      }
    }
    return throwError(error);
  }
}
