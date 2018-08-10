import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApplicationRoutingModule} from './application-routing.module';
import {ApplicationListComponent} from './application-list/application-list.component';
import {WsApplicationFilterComponent} from './application-filter/application-filter.component';
import {ApplicationTableComponent} from './application-table/application-table.component';
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
import {ApplicationFormComponent} from './application-form/application-form.component';
import {ApplicationColumnComponent} from './application-column/application-column.component';
import {ApplicationHealthcheckModule} from '../application-healthcheck/application-healthcheck.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    FormsModule,

    ApplicationHealthcheckModule,
    SharedModule,

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
    ApplicationListComponent,
    WsApplicationFilterComponent,
    ApplicationTableComponent,
    ApplicationColumnComponent,
    ApplicationFormComponent,
  ],
})
export class ApplicationModule {
}
