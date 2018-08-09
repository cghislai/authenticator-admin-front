import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, EMPTY, Observable, Subscription, timer} from 'rxjs';
import {BACKEND_URL_TOKEN} from './configuration/backend-url-token';
import {catchError, first, mergeMap, take, throwIfEmpty} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {JosePayload} from './domain/JosePayload';
import moment from 'moment-es6';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private static TOKEN_STORAGE_KEY = 'token';

  private token = new BehaviorSubject<string>(null);

  private tokenExpirationSubscription: Subscription;

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              private router: Router,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
    timer(100)
      .subscribe(() => this.loadTokenFromStorage());
  }

  login(userName: string, password: string) {
    const base64Credentials = btoa(`${userName}:${password}`);
    const headers = new HttpHeaders()
      .set('Authorization', `Basic ${base64Credentials}`);
    this.httpClient.get(`${this.backendUrl}/token`, {
      responseType: 'text',
      withCredentials: true,
      headers: headers,
    }).subscribe(
      token => this.setToken(token),
      error => this.onLoginError(error),
    );
  }

  hasValidToken(): boolean {
    return this.token.getValue() != null;
  }

  getToken() {
    return this.token.getValue();
  }

  getTokenObservable() {
    return this.token.asObservable();
  }

  clearToken() {
    this.setToken(null);
    this.unWatchTokenExpiration();
    this.router.navigate(['/']);
  }

  private setToken(token: string) {
    if (token == null) {
      this.clearTokenFromStorage();
    } else {
      this.persistToken(token);
      const payload = this.decodeJwtPayload(token);
      this.watchTokenExpiration(payload);
    }
    this.token.next(token);
  }

  private renewToken(): Observable<string> {
    return this.httpClient.get(`${this.backendUrl}/token`, {
      responseType: 'text',
      withCredentials: true,
    }).pipe(
      catchError(() => EMPTY),
    );
  }

  private onLoginError(error: any) {
    this.clearToken();

    let errorMessage: string;
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage = 'Could not contact the service';
          break;
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        default:
          errorMessage = 'Unkown server error';
          break;
      }
    } else {
      errorMessage = 'Unknown error: ' + error;
    }
    this.messageService.add({
      severity: 'error',
      summary: errorMessage,
    });
  }

  private decodeJwtPayload(token: string | null): JosePayload | null {
    if (token == null) {
      return null;
    }
    const joseParts = token.split('.');
    const encodedPayload = joseParts[1];
    const payloadJson = atob(encodedPayload);
    const payload: JosePayload = JSON.parse(payloadJson);

    return payload;
  }

  private watchTokenExpiration(payload: JosePayload) {
    this.unWatchTokenExpiration();
    if (payload == null) {
      return;
    }
    const renewalMoment = this.getTokenRenewalMoment(payload);
    this.tokenExpirationSubscription = timer(renewalMoment.toDate(), 5000).pipe(
      take(5),
      mergeMap(() => this.renewToken()),
      throwIfEmpty(() => new Error('Could not renew token')),
      first(),
    ).subscribe(
      token => this.setToken(token),
      error => this.onTokenRenewalError(error),
    );
  }

  private unWatchTokenExpiration() {
    if (this.tokenExpirationSubscription) {
      this.tokenExpirationSubscription.unsubscribe();
    }
  }

  private getTokenRenewalMoment(payload: JosePayload): moment.Moment {
    const expirationMoment = moment.unix(payload.exp);
    const thirtySecondsBeforeExpiration = expirationMoment.clone()
      .add(-30, 'seconds');
    return thirtySecondsBeforeExpiration;
  }

  private onTokenRenewalError(error: any) {
    console.warn(error);
    this.clearToken();
  }

  private persistToken(token: string) {
    if (localStorage == null) {
      return;
    }
    localStorage.setItem(TokenService.TOKEN_STORAGE_KEY, token);
  }

  private clearTokenFromStorage() {
    if (localStorage == null) {
      return;
    }
    localStorage.removeItem(TokenService.TOKEN_STORAGE_KEY);
  }

  private loadTokenFromStorage() {
    if (localStorage == null) {
      return;
    }
    const token = localStorage.getItem(TokenService.TOKEN_STORAGE_KEY);
    if (token == null) {
      return;
    }
    const authorizationHeader = `Bearer ${token}`;
    const header = new HttpHeaders()
      .set('Authorization', authorizationHeader);
    return this.httpClient.get(`${this.backendUrl}/token`, {
      responseType: 'text',
      withCredentials: true,
      headers: header,
    }).subscribe(
      renewedToken => this.setToken(renewedToken),
      error => this.clearToken(),
    );
  }
}
