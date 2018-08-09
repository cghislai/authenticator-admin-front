import {Inject, Injectable} from '@angular/core';
import {BACKEND_URL_TOKEN} from '../../configuration/backend-url-token';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {KeyFilter, Pagination, WsKey} from '@charlyghislain/core-web-api';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ListResult} from '../../domain/list-result';
import {QueryParamsUtils} from '../../utils/query-params-utils';
import {ListResultsUtils} from '../../utils/list-results-utils';

@Injectable({
  providedIn: 'root',
})
export class KeyService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
  }

  listKeys(filter: KeyFilter, pagination: Pagination): Observable<ListResult<WsKey>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, pagination);
    return this.httpClient.get<WsKey[]>(
      `${this.backendUrl}/admin/key/list`, {
        params: queryParams,
        observe: 'response',
      }).pipe(map(response => ListResultsUtils.wrapResponse(response)));
  }

  saveKey(key: WsKey): Observable<WsKey> {
    if (key.id != null) {
      return this.updateKey(key);
    } else {
      return this.createKey(key);
    }

  }

  createEmptyKey(): WsKey {
    return {
      id: null,
      name: null,
      active: true,
      forApplicationSecrets: false,
      creationDateTime: null,
      componentId: null,
    };
  }

  private createKey(key: WsKey): Observable<WsKey> {
    return this.httpClient.post<WsKey>(
      `${this.backendUrl}/admin/key/`, key)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private updateKey(key: WsKey): Observable<WsKey> {
    return this.httpClient.put<WsKey>(
      `${this.backendUrl}/admin/key/${key.id}`, key)
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
