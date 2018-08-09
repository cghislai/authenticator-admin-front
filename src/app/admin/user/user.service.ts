import {Inject, Injectable} from '@angular/core';
import {BACKEND_URL_TOKEN} from '../../configuration/backend-url-token';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Pagination, UserFilter, WsUser} from '@charlyghislain/core-web-api';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ListResult} from '../../domain/list-result';
import {QueryParamsUtils} from '../../utils/query-params-utils';
import {ListResultsUtils} from '../../utils/list-results-utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
  }

  listUsers(filter: UserFilter, pagination: Pagination): Observable<ListResult<WsUser>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, pagination);
    return this.httpClient.get<WsUser[]>(
      `${this.backendUrl}/admin/user/list`, {
        params: queryParams,
        observe: 'response',
      }).pipe(map(response => ListResultsUtils.wrapResponse(response)));
  }

  saveUser(user: WsUser): Observable<WsUser> {
    if (user.id != null) {
      return this.updateUser(user);
    } else {
      return this.createUser(user);
    }

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
      `${this.backendUrl}/admin/user/`, user)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private updateUser(user: WsUser): Observable<WsUser> {
    return this.httpClient.put<WsUser>(
      `${this.backendUrl}/admin/user/${user.id}`, user)
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
}
