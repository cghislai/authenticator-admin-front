import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KeyRoutingModule} from './key-routing.module';
import {KeyListComponent} from './key-list/key-list.component';
import {KeyFilterComponent} from './key-filter/key-filter.component';
import {KeyTableComponent} from './key-table/key-table.component';
import {FormsModule} from '@angular/forms';
import {
  ButtonModule,
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
import {ApplicationComponentModule} from '../application-component/application-component.module';
import {ApplicationComponentSelectModule} from '../application-component-select/application-component-select.module';

@NgModule({
  imports: [
    CommonModule,
    KeyRoutingModule,
    FormsModule,

    ApplicationComponentModule,
    ApplicationComponentSelectModule,

    TriStateCheckboxModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    DialogModule,
    InplaceModule,
    InputTextareaModule,
  ],
  declarations: [
    KeyListComponent,
    KeyFilterComponent,
    KeyTableComponent,
    KeyColumnComponent,
    KeyFormComponent,
  ],
})
export class KeyModule {
}
