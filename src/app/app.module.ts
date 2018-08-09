import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule, InplaceModule, InputTextModule, MessageService, PasswordModule} from 'primeng/primeng';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptorService} from './token-interceptor.service';
import {AppHeaderComponent} from './app-header/app-header.component';
import {UserInfoComponent} from './user-info/user-info.component';
import { UserInfoFormComponent } from './user-info-form/user-info-form.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    InplaceModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    AppHeaderComponent,
    UserInfoComponent,
    UserInfoFormComponent,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
