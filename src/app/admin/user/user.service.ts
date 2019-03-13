import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {QueryParamsUtils} from '../../utils/query-params-utils';
import {ADMIN_API_URL_TOKEN} from '../../configuration/admin-api-url-token';
import {WsPagination, WsResultList, WsUser, WsUserApplication, WsUserFilter} from '@charlyghislain/authenticator-admin-api';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(ADMIN_API_URL_TOKEN) private backendUrl: string) {
  }

  listUsers(filter: WsUserFilter, wsPagination: WsPagination): Observable<WsResultList<WsUser>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, wsPagination);
    return this.httpClient.get<WsResultList<WsUser>>(
      `${this.backendUrl}/user/list`, {
        params: queryParams,
      });
  }

  saveUser(user: WsUser): Observable<WsUser> {
    if (user.id != null) {
      return this.updateUser(user);
    } else {
      return this.createUser(user);
    }
  }

  setUserPassword(user: WsUser, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain');
    return this.httpClient.put(`${this.backendUrl}/user/${user.id}/password`, password, {
      headers: headers,
    }).pipe(
      tap(
        () => this.onSetPasswordSuccess(),
        (error) => this.onSetPasswordError(error),
      ),
    );
  }

  listUserAplications(userId: number): Observable<WsResultList<WsUserApplication>> {
    return this.httpClient.get<WsResultList<WsUserApplication>>(
      `${this.backendUrl}/user/${userId}/application/list`);
  }

  setUserApplicationActive(userId: number, appId: number): Observable<WsUserApplication> {
    return this.httpClient.put<WsUserApplication>(
      `${this.backendUrl}/user/${userId}/application/${appId}/state/active`, null)
      .pipe(
        tap(
          () => this.onSetUserApplicationActiveSuccess(),
          (error) => this.onSetUserApplicationActiveError(error),
        ),
      );
  }

  setUserApplicationInactive(userId: number, appId: number): Observable<WsUserApplication> {
    return this.httpClient.delete<WsUserApplication>(
      `${this.backendUrl}/user/${userId}/application/${appId}/state/active`)
      .pipe(
        tap(
          () => this.onSetUserApplicationActiveSuccess(),
          (error) => this.onSetUserApplicationActiveError(error),
        ),
      );
  }

  removeUser(userId: number): Observable<any> {
    return this.httpClient.delete(`${this.backendUrl}/user/${userId}`).pipe(
      tap(
        () => this.onDeleteUserSuccess(),
        (error) => this.onDeleteUserError(error),
      ),
    );
  }

  createEmptyUser(): WsUser {
    return {
      id: null,
      name: null,
      email: null,
      active: true,
      admin: false,
      emailVerified: false,
      passwordExpired: false,
    };
  }

  private createUser(user: WsUser): Observable<WsUser> {
    return this.httpClient.post<WsUser>(
      `${this.backendUrl}/user/`, user)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private updateUser(user: WsUser): Observable<WsUser> {
    return this.httpClient.put<WsUser>(
      `${this.backendUrl}/user/${user.id}`, user)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private onSaveSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'User saved',
    });
  }

  private onSaveError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'User could not be saved',
    });
  }

  private onSetPasswordSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Pasword updated',
    });
  }

  private onSetPasswordError(error: any) {
    const details = this.getSetPasswordErrorDetails(error);
    this.messageService.add({
      severity: 'error',
      summary: 'Password could not be updated',
      detail: details,
    });
  }

  private onSetUserApplicationActiveSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'User application updated',
    });
  }

  private onSetUserApplicationActiveError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'User applicatoin could not be updated',
    });
  }


  private onDeleteUserSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'User removed',
    });
  }


  private onDeleteUserError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'User could not be removed',
    });
  }

  private getSetPasswordErrorDetails(error: any) {
    if (error instanceof HttpErrorResponse) {
      const errorBody = error.error;
      if (errorBody != null && errorBody.code != null) {
        return this.getSetPasswordErrorDetailsMessage(errorBody.code, errorBody.description);
      }
    }
  }

  private getSetPasswordErrorDetailsMessage(code: string, description: string) {
    switch (code) {
      case 'INVALID_PASSWORD': {
        return `Invalid password`;
      }
    }
  }
}
