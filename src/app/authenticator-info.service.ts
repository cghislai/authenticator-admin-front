import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {catchError, mergeMap, publishReplay, refCount} from 'rxjs/operators';
import {Message, MessageService} from 'primeng/api';
import {API_URL_TOKEN} from './configuration/api-url-token';
import {WsAuthenticatorInfo} from '@charlyghislain/authenticator-api';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorInfoService {

  constructor(private httpClient: HttpClient,
              private messageService: MessageService,
              @Inject(API_URL_TOKEN) private backendUrl: string) {

  }

  fetchProviderInfo(): Observable<WsAuthenticatorInfo> {
    return this.httpClient.get<WsAuthenticatorInfo>(`${this.backendUrl}/info`)
      .pipe(
        catchError((e, caught) => this.onError(e, caught)),
        publishReplay(1), refCount(),
      );
  }


  private onError(e: any, caught: Observable<WsAuthenticatorInfo>) {
    const message: Message = {
      severity: 'error',
      summary: 'Failed to fetch provider info',
    };
    if (e instanceof Error) {
      message.detail = e.message;
    }
    this.messageService.add(message);
    return timer(5000).pipe(
      mergeMap(() => caught),
    );
  }
}
