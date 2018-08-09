import {enableProdMode, Provider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {BACKEND_URL_TOKEN} from './app/configuration/backend-url-token';

if (environment.production) {
  enableProdMode();
}

const backendUrlProvider: Provider = {
  provide: BACKEND_URL_TOKEN,
  useValue: environment.backendUrl,
};

platformBrowserDynamic([
  backendUrlProvider,
]).bootstrapModule(AppModule)
  .catch(err => console.log(err));
