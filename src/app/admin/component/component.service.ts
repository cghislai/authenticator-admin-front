import {Inject, Injectable} from '@angular/core';
import {BACKEND_URL_TOKEN} from '../../configuration/backend-url-token';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {ComponentFilter, Pagination, WsApplicationComponent} from '@charlyghislain/core-web-api';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ListResult} from '../../domain/list-result';
import {QueryParamsUtils} from '../../utils/query-params-utils';
import {ListResultsUtils} from '../../utils/list-results-utils';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {
  }

  listComponents(filter: ComponentFilter, pagination: Pagination): Observable<ListResult<WsApplicationComponent>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, pagination);
    return this.httpClient.get<WsApplicationComponent[]>(
      `${this.backendUrl}/admin/component/list`, {
        params: queryParams,
        observe: 'response',
      }).pipe(map(response => ListResultsUtils.wrapResponse(response)));
  }

  saveComponent(component: WsApplicationComponent): Observable<WsApplicationComponent> {
    if (component.id != null) {
      return this.updateComponent(component);
    } else {
      return this.createComponent(component);
    }

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
