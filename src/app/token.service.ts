import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, EMPTY, Observable, Subscription, timer} from 'rxjs';
import {BACKEND_URL_TOKEN} from './configuration/backend-url-token';
import {catchError, delay, first, map, mergeMap, publishReplay, refCount, take, tap, throwIfEmpty} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {JosePayload} from './domain/JosePayload';
import moment from 'moment-es6';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private token = new BehaviorSubject<string>(null);
  private josePayload: Observable<JosePayload>;

  private newTokenSubscription: Subscription;
  private tokenExpirationSubscription: Subscription;

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              private router: Router,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
    this.josePayload = this.token.pipe(
      map(token => this.decodeJwtPayload(token)),
      publishReplay(1), refCount(),
    );
    this.newTokenSubscription = this.josePayload
      .subscribe(payload => this.watchTokenExpiration(payload));
  }

  login(userName: string, password: string): Observable<any> {
    const base64Credentials = btoa(`${userName}:${password}`);
    const headers = new HttpHeaders()
      .set('Authorization', `Basic ${base64Credentials}`);
    const loginTask = this.httpClient.get(`${this.backendUrl}/token`, {
      responseType: 'text',
      withCredentials: true,
      headers: headers,
    }).pipe(
      delay(0),
      tap(
        token => this.token.next(token),
        error => this.onLoginError(error),
      ),
    );
    return loginTask;
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
    this.token.next(null);
    this.unWatchTokenExpiration();
    this.router.navigate(['/']);
  }

  private renewToken() {
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
      token => this.token.next(token),
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
}
