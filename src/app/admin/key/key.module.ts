import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KeyRoutingModule} from './key-routing.module';
import {KeyListComponent} from './key-list/key-list.component';
import {WsKeyFilterComponent} from './key-filter/key-filter.component';
import {KeyTableComponent} from './key-table/key-table.component';
import {FormsModule} from '@angular/forms';
import {
  ButtonModule, CheckboxModule,
  DialogModule,
  InplaceModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  TriStateCheckboxModule,
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {KeyColumnComponent} from './key-column/key-column.component';
import {KeyFormComponent} from './key-form/key-form.component';
import {ApplicationSelectModule} from '../../shared/application-select/application-select.module';
import {ApplicationModule} from '../../shared/application/application.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    KeyRoutingModule,
    FormsModule,

    ApplicationModule,
    ApplicationSelectModule,
    SharedModule,

    TriStateCheckboxModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    InputSwitchModule,
    DialogModule,
    InplaceModule,
    InputTextareaModule,
  ],
  declarations: [
    KeyListComponent,
    WsKeyFilterComponent,
    KeyTableComponent,
    KeyColumnComponent,
    KeyFormComponent,
  ],
})
export class KeyModule {
}
