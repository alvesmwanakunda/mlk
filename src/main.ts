/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  ['log','debug','info','warn'].forEach(m => (console as any)[m] = () => {});
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
