import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';

import {AppComponent} from './app.component';
import {DataTableCrudComponent} from './section/crud.component';
import {routes} from './app-routing.module';

import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions} from '@angular/http';
import {fakeBackendProvider} from './backend/fake-backend';
import {EmployeeService} from './section/service/employee.service';

@NgModule({
  imports: [
      BrowserModule,
      BrowserAnimationsModule,
      routes,
      FormsModule,
      HttpModule,
      HttpClientModule
  ],
  declarations: [AppComponent, DataTableCrudComponent],
  providers: [
      {provide: APP_BASE_HREF, useValue: '/'},
      EmployeeService,
      fakeBackendProvider,
      MockBackend,
      BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
