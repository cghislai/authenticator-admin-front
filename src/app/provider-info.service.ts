import {Inject, Injectable} from '@angular/core';
import {BACKEND_URL_TOKEN} from './configuration/backend-url-token';
import {WsProviderInfo} from '@charlyghislain/core-web-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProviderInfoService {

  constructor(private httpClient: HttpClient,
              @Inject(BACKEND_URL_TOKEN) private backendUrl: string) {

  }

  fetchProviderInfo(): Observable<WsProviderInfo> {
    return this.httpClient.get<WsProviderInfo>(`${this.backendUrl}/info`);
  }
}
