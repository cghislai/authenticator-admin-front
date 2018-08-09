import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserListComponent} from './user-list/user-list.component';
import {UserFilterComponent} from './user-filter/user-filter.component';
import {UserTableComponent} from './user-table/user-table.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, DialogModule, InputSwitchModule, InputTextModule, TriStateCheckboxModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {UserColumnComponent} from './user-column/user-column.component';
import {UserFormComponent} from './user-form/user-form.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,

    TriStateCheckboxModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    DialogModule,
  ],
  declarations: [
    UserListComponent,
    UserFilterComponent,
    UserTableComponent,
    UserColumnComponent,
    UserFormComponent,
  ],
})
export class UserModule {
}
