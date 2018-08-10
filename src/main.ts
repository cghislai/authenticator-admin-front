import {enableProdMode, Provider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {ADMIN_API_URL_TOKEN} from './app/configuration/admin-api-url-token';
import {API_URL_TOKEN} from './app/configuration/api-url-token';

if (environment.production) {
  enableProdMode();
}

const apiUrlProvider: Provider = {
  provide: API_URL_TOKEN,
  useValue: environment.authenticatorApiUrl,
};
const adminApiUrlProvider: Provider = {
  provide: ADMIN_API_URL_TOKEN,
  useValue: environment.authenticatorAdminApiUrl,
};

platformBrowserDynamic([
  apiUrlProvider,
  adminApiUrlProvider,
]).bootstrapModule(AppModule)
  .catch(err => console.log(err));
