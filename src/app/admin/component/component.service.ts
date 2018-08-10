import {Inject, Injectable} from '@angular/core';
import {BACKEND_URL_TOKEN} from '../../configuration/backend-url-token';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {
  WsApplicationComponent,
  WsApplicationComponentHealth,
  WsComponentFilter,
  WsPagination,
  WsResultList,
} from '@charlyghislain/core-web-api';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {QueryParamsUtils} from '../../utils/query-params-utils';


@Injectable({
  providedIn: 'root',
})
export class ComponentService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
  }

  listComponents(filter: WsComponentFilter, wsPagination: WsPagination): Observable<WsResultList<WsApplicationComponent>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, wsPagination);
    return this.httpClient.get<WsResultList<WsApplicationComponent>>(
      `${this.backendUrl}/admin/component/list`, {
        params: queryParams,
      });
  }

  getComponent(id: number): Observable<WsApplicationComponent> {
    return this.httpClient.get<WsApplicationComponent>(
      `${this.backendUrl}/admin/component/${id}`);
  }


  checkComponentHealth(id: number): Observable<WsApplicationComponentHealth> {
    return this.httpClient.get<WsApplicationComponentHealth>(
      `${this.backendUrl}/admin/component/${id}/health`);
  }

  saveComponent(component: WsApplicationComponent): Observable<WsApplicationComponent> {
    if (component.id != null) {
      return this.updateComponent(component);
    } else {
      return this.createComponent(component);
    }

  }

  createComponentSecret(component: WsApplicationComponent): Observable<string> {
    return this.httpClient.get(
      `${this.backendUrl}/admin/component/${component.id}/secretToken`, {
        responseType: 'text',
      }).pipe(
      tap(null, (error) => this.messageService.add({
        severity: 'error',
        summary: 'Could not generate component secret',
      })),
    );
  }

  getPublicKeyUrl(component: WsApplicationComponent): string {
    if (component == null || component.name == null) {
      return null;
    }
    return `${this.backendUrl}/info/component/${component.name}/publicKey`;
  }


  getPublicKey(component: WsApplicationComponent): Observable<string> {
    if (component == null || component.name == null) {
      return null;
    }
    return this.httpClient.get(
      `${this.backendUrl}/info/component/${component.name}/publicKey`, {
        responseType: 'text',
      }).pipe(
      tap(null, (error) => this.messageService.add({
        severity: 'error',
        summary: 'Could not load public key',
      })),
    );
  }

  createEmptyComponent(): WsApplicationComponent {
    return {
      id: null,
      active: true,
      endpointUrl: null,
      name: null,
    };
  }

  private createComponent(component: WsApplicationComponent): Observable<WsApplicationComponent> {
    return this.httpClient.post<WsApplicationComponent>(
      `${this.backendUrl}/admin/component/`, component)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private updateComponent(component: WsApplicationComponent): Observable<WsApplicationComponent> {
    return this.httpClient.put<WsApplicationComponent>(
      `${this.backendUrl}/admin/component/${component.id}`, component)
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
      summary: 'Component saved',
    });
  }

  private onSaveError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Component could not be saved',
    });
  }
}
