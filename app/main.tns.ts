import {nativeScriptBootstrap} from "nativescript-angular/application";
import {nsProvideRouter} from "nativescript-angular/router";
import {HTTP_PROVIDERS} from '@angular/http';
import {provide} from '@angular/core';

import {Config, TNS_CONFIG}    from './client/app.config';
import {AppComponent, APP_ROUTES} from "./client/app.component";
import {MarketService} from './client/services/market.service'

nativeScriptBootstrap(AppComponent, [
  provide(Config, { useValue: TNS_CONFIG }),
  nsProvideRouter(APP_ROUTES, {}),
  HTTP_PROVIDERS,
  MarketService
]
).catch(err => console.error(err));

