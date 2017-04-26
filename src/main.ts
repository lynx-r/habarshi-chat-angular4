import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
} else if (!/localhost/.test(document.location.host)) { // Enable production mode unless running locally
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
