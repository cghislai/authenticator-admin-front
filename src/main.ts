import {enableProdMode, Provider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {ADMIN_API_URL_TOKEN} from './app/configuration/admin-api-url-token';
import {API_URL_TOKEN} from './app/configuration/api-url-token';
import {ResourceUtils} from './resource-utils';
import {AdminFrontendConfig} from './app/configuration/admin-frontend-config';
import {catchError, defaultIfEmpty, map, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';

if (environment.production) {
  enableProdMode();
}

const buildTimeConfig: AdminFrontendConfig = {
  authenticatorAdminApiUrl: environment.authenticatorAdminApiUrl,
  authenticatorApiUrl: environment.authenticatorApiUrl,
};
const runTimeConfig$ = ResourceUtils.fetchResourceAsString('authenticator-admin-config.json').pipe(
  map(json => <AdminFrontendConfig>JSON.parse(json)),
  catchError(e => of(buildTimeConfig)),
  defaultIfEmpty(buildTimeConfig),
);

runTimeConfig$.pipe(
  mergeMap(config => {
    const apiUrlProvider: Provider = {
      provide: API_URL_TOKEN,
      useValue: config.authenticatorApiUrl,
    };
    const adminApiUrlProvider: Provider = {
      provide: ADMIN_API_URL_TOKEN,
      useValue: config.authenticatorAdminApiUrl,
    };

    return platformBrowserDynamic([
      apiUrlProvider,
      adminApiUrlProvider,
    ]).bootstrapModule(AppModule);
  }),
).subscribe(() => {
  },
  error => {
    console.error(error);
  });
