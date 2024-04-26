import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import '@angular/common/locales/global/fr';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtService } from './shared/interceptors/jwt.service';
import { registerLocaleData,HashLocationStrategy, LocationStrategy, PathLocationStrategy, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr,'fr');



@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtService,
    multi:true
  },
  {
    provide: LOCALE_ID, useValue:'fr'
  },
  Location,
  {
    provide: LocationStrategy, useClass:PathLocationStrategy
  },
  HttpClient
 ],
  bootstrap: [AppComponent],
})
export class AppModule { }
