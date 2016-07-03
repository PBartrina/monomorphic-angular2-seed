import {bootstrap} from '@angular/platform-browser-dynamic';
import {provideRouter} from "@angular/router";
import {HTTP_PROVIDERS} from '@angular/http';
import {provide} from '@angular/core';
import {MarketService} from './client/services/market.service'
import {Config, WEB_CONFIG}    from './client/app.config';
import {AppComponent, APP_ROUTES} from "./client/app.component";

require('./app.scss')
bootstrap(AppComponent, [
  provide(Config, { useValue: WEB_CONFIG }),
  provideRouter(APP_ROUTES),
  MarketService,
  HTTP_PROVIDERS])
  .catch(err => console.error(err));
