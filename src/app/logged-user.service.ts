import {Inject, Injectable} from '@angular/core';
import {BACKEND_URL_TOKEN} from './configuration/backend-url-token';
import {EMPTY, Observable, of} from 'rxjs';
import {WsUser} from '@charlyghislain/core-web-api';
import {TokenService} from './token.service';
import {catchError, filter, mergeMap, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {

  private loggedUser: Observable<WsUser>;

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,
              private messageService: MessageService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
    this.loggedUser = this.tokenService.getTokenObservable().pipe(
      switchMap(token => token == null ? of(null) : this.fetchLoggedUser()),
      publishReplay(1), refCount(),
    );
  }

  getLoggedUser(): Observable<WsUser> {
    return this.loggedUser.pipe(
      take(1),
      filter(u => u != null),
    );
  }


  waitNextLoggedUser(): Observable<WsUser> {
    return this.loggedUser.pipe(
      filter(u => u != null),
      take(1),
    );
  }

  getLoggedUserObservable(): Observable<WsUser> {
    return this.loggedUser.pipe();
  }

  updateUserName(name: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain');
    return this.httpClient.put(`${this.backendUrl}/me/name`, name, {
      responseType: 'text',
      headers: headers,
    })
      .subscribe(
        () => this.onUpdateNameSuccess(),
        e => this.onUpdateNameError(e),
      );
  }

  updateUserPassword(password: string) {
    return this.httpClient.put(`${this.backendUrl}/me/password`, password)
      .subscribe(
        () => this.onUpdatePasswordSuccess(),
        e => this.onUpdatePasswordError(e),
      );
  }

  updateUserMail(name: string): Observable<WsUser> {
    return this.httpClient.put(`${this.backendUrl}/me/email`, name)
      .pipe(
        mergeMap(() => this.fetchLoggedUser()),
        catchError(e => this.onUpdateEmailError(e)),
      );
  }


  private fetchLoggedUser(): Observable<WsUser> {
    return this.httpClient.get<WsUser>(`${this.backendUrl}/me`);
  }

  private onUpdateNameSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Name updated',
    });
    this.tokenService.clearToken();
  }

  private onUpdateNameError(e: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not update name',
    });
  }


  private onUpdateEmailSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Email updated',
    });
    this.tokenService.clearToken();
  }

  private onUpdateEmailError(e: any): Observable<any> {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not update email',
    });
    return EMPTY;
  }


  private onUpdatePasswordSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Password updated',
    });
    this.tokenService.clearToken();
  }

  private onUpdatePasswordError(e: any): Observable<any> {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not update password',
    });
    return EMPTY;
  }
}
