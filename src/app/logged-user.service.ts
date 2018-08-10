import {Inject, Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {TokenService} from './token.service';
import {catchError, filter, mergeMap, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {WsUser, WsUserApplication} from '@charlyghislain/authenticator-api';
import {API_URL_TOKEN} from './configuration/api-url-token';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {

  private loggedUser: Observable<WsUser>;
  private loggedUserApplications: Observable<WsUserApplication[]>;

  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,
              private messageService: MessageService,
              @Inject(API_URL_TOKEN) private backendUrl: string) {
    this.loggedUser = this.tokenService.getTokenObservable().pipe(
      switchMap(token => token == null ? of(null) : this.fetchLoggedUser()),
      publishReplay(1), refCount(),
    );
    this.loggedUserApplications = this.loggedUser.pipe(
      switchMap(() => this.fetchLoggedUserApplications()),
      publishReplay(1), refCount(),
    );
  }

  refresh() {
    this.tokenService.reemitToken();
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
    return this.loggedUser;
  }

  getLoggedUserApplicationsObservable(): Observable<WsUserApplication[]> {
    return this.loggedUserApplications;
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

  unlinkApplication(appId: number): Observable<any> {
    return this.httpClient.delete(`${this.backendUrl}/me/application/${appId}`)
      .pipe(
        tap(
          () => this.onUnlinkAppSuccess(),
          error => this.onUnlinkAppError(error),
        ),
      );
  }

  private fetchLoggedUserApplications() {
    return this.httpClient.get(`${this.backendUrl}/me/application/list`)
      .pipe(
        catchError(e => this.onFetchApplicationsError(e)),
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

  private onFetchApplicationsError(e: any): Observable<any> {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not fetch the application list',
    });
    return EMPTY;
  }

  private onUnlinkAppSuccess(): Observable<any> {
    this.messageService.add({
      severity: 'success',
      summary: 'Your account has been unlinked to this application',
    });
    return EMPTY;
  }

  private onUnlinkAppError(error: any): Observable<any> {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not unlink this application',
    });
    return EMPTY;
  }
}
