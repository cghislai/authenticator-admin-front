import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserInfoComponent} from './user-info/user-info.component';
import {UserInfoFormComponent} from './user-info-form/user-info-form.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ButtonModule, InplaceModule, InputTextModule, PasswordModule} from 'primeng/primeng';
import {UserAreaComponent} from './user-area/user-area.component';
import {UserAreaRoutingModule} from './user-area-routing.module';
import {LoggedUserApplicationComponent} from './logged-user-application/logged-user-application.component';
import {LoggedUserApplicationListComponent} from './logged-user-application-list/logged-user-application-list.component';
import {DataViewModule} from 'primeng/dataview';
import {ToastModule} from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    UserAreaRoutingModule,
    FormsModule,
    HttpClientModule,

    ToastModule,
    DataViewModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InplaceModule,
  ],
  declarations: [
    UserInfoComponent,
    UserInfoFormComponent,
    UserAreaComponent,

    LoggedUserApplicationComponent,
    LoggedUserApplicationListComponent,
  ],
})
export class UserAreaModule {
}
