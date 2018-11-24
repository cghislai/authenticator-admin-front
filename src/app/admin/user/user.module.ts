import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserListComponent} from './user-list/user-list.component';
import {WsUserFilterComponent} from './user-filter/user-filter.component';
import {UserTableComponent} from './user-table/user-table.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, CheckboxModule, DialogModule, InputSwitchModule, InputTextModule, TriStateCheckboxModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {UserColumnComponent} from './user-column/user-column.component';
import {UserFormComponent} from './user-form/user-form.component';
import {DataViewModule} from 'primeng/dataview';
import {UserApplicationComponent} from './user-application/user-application.component';
import {UserApplicationListComponent} from './user-application-list/user-application-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ToastModule} from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,

    SharedModule,

    TriStateCheckboxModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    DialogModule,
    CheckboxModule,
    DataViewModule,
    ToastModule,
  ],
  declarations: [
    UserListComponent,
    WsUserFilterComponent,
    UserTableComponent,
    UserColumnComponent,
    UserFormComponent,
    UserApplicationListComponent,
    UserApplicationComponent,
  ],
})
export class UserModule {
}
