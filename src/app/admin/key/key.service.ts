import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {QueryParamsUtils} from '../../utils/query-params-utils';
import {WsKey, WsKeyFilter, WsPagination, WsResultList} from '@charlyghislain/authenticator-admin-api';
import {ADMIN_API_URL_TOKEN} from '../../configuration/admin-api-url-token';


@Injectable({
  providedIn: 'root',
})
export class KeyService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(ADMIN_API_URL_TOKEN) private backendUrl: string) {
  }

  listKeys(filter: WsKeyFilter, wsPagination: WsPagination): Observable<WsResultList<WsKey>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, wsPagination);
    return this.httpClient.get<WsResultList<WsKey>>(
      `${this.backendUrl}/key/list`, {
        params: queryParams,
      });
  }

  saveKey(key: WsKey): Observable<WsKey> {
    if (key.id != null) {
      return this.updateKey(key);
    } else {
      return this.createKey(key);
    }

  }

  loadPublicKey(key: WsKey): Observable<string> {
    return this.httpClient.get(
      `${this.backendUrl}/key/${key.id}/public`, {
        responseType: 'text',
      }).pipe(
      tap(null, (error) => this.messageService.add({
        severity: 'error',
        summary: 'Could not load public key',
      })),
    );
  }

  createEmptyKey(): WsKey {
    return {
      id: null,
      name: null,
      active: true,
      forApplicationSecrets: false,
      creationDateTime: null,
      applicationId: null,
      signingKey: true,
    };
  }

  private createKey(key: WsKey): Observable<WsKey> {
    return this.httpClient.post<WsKey>(
      `${this.backendUrl}/key/`, key)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private updateKey(key: WsKey): Observable<WsKey> {
    return this.httpClient.put<WsKey>(
      `${this.backendUrl}/key/${key.id}`, key)
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
      summary: 'Key saved',
    });
  }

  private onSaveError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Key could not be saved',
    });
  }
}
