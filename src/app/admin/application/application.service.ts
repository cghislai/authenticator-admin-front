import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {QueryParamsUtils} from '../../utils/query-params-utils';
import {WsApplication, WsApplicationFilter, WsApplicationHealth, WsPagination, WsResultList} from '@charlyghislain/authenticator-admin-api';
import {ADMIN_API_URL_TOKEN} from '../../configuration/admin-api-url-token';
import {API_URL_TOKEN} from '../../configuration/api-url-token';


@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(API_URL_TOKEN) private apiUrl: string,
              @Inject(ADMIN_API_URL_TOKEN) private adminApiUrl: string) {
  }

  listApplications(filter: WsApplicationFilter, wsPagination: WsPagination): Observable<WsResultList<WsApplication>> {
    const queryParams = QueryParamsUtils.toQueryParams(filter, wsPagination);
    return this.httpClient.get<WsResultList<WsApplication>>(
      `${this.adminApiUrl}/application/list`, {
        params: queryParams,
      });
  }

  getApplication(id: number): Observable<WsApplication> {
    return this.httpClient.get<WsApplication>(
      `${this.adminApiUrl}/application/${id}`);
  }


  checkApplicationHealth(id: number): Observable<WsApplicationHealth> {
    return this.httpClient.get<WsApplicationHealth>(
      `${this.adminApiUrl}/application/${id}/health`);
  }

  saveApplication(application: WsApplication): Observable<WsApplication> {
    if (application.id != null) {
      return this.updateApplication(application);
    } else {
      return this.createApplication(application);
    }

  }

  createApplicationSecret(application: WsApplication): Observable<string> {
    return this.httpClient.get(
      `${this.adminApiUrl}/application/${application.id}/secretToken`, {
        responseType: 'text',
      }).pipe(
      tap(null, (error) => this.messageService.add({
        severity: 'error',
        summary: 'Could not generate application secret',
      })),
    );
  }

  getPublicKeyUrl(application: WsApplication): string {
    if (application == null || application.name == null) {
      return null;
    }
    return `${this.apiUrl}/info/app/${application.name}/publicKey`;
  }


  getPublicKey(application: WsApplication): Observable<string> {
    if (application == null || application.name == null) {
      return null;
    }
    return this.httpClient.get(
      `${this.apiUrl}/info/app/${application.name}/publicKey`, {
        responseType: 'text',
      }).pipe(
      tap(null, (error) => this.messageService.add({
        severity: 'error',
        summary: 'Could not load public key',
      })),
    );
  }


  removeApplication(applicationId: number): Observable<any> {
    return this.httpClient.delete(`${this.adminApiUrl}/application/${applicationId}`).pipe(
      tap(
        () => this.onDeleteApplicationSuccess(),
        (error) => this.onDeleteApplicationError(error),
      ),
    );
  }

  createEmptyApplication(): WsApplication {
    return {
      id: null,
      active: true,
      endpointUrl: null,
      name: null,
      canResetUserPassword: true,
      canVerifyUserEmail: true,
      addedUsersAreActive: true,
      existingUsersAreAddedOnTokenRequest: true,
    };
  }

  private createApplication(application: WsApplication): Observable<WsApplication> {
    return this.httpClient.post<WsApplication>(
      `${this.adminApiUrl}/application/`, application)
      .pipe(
        tap(
          () => this.onSaveSuccess(),
          (error) => this.onSaveError(error),
        ),
      );
  }

  private updateApplication(application: WsApplication): Observable<WsApplication> {
    return this.httpClient.put<WsApplication>(
      `${this.adminApiUrl}/application/${application.id}`, application)
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
      summary: 'Application saved',
    });
  }

  private onSaveError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Application could not be saved',
    });
  }


  private onDeleteApplicationSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Application removed',
    });
  }


  private onDeleteApplicationError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Application could not be removed',
    });
  }
}
