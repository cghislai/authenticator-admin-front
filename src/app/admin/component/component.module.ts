import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComponentRoutingModule} from './component-routing.module';
import {ComponentListComponent} from './component-list/component-list.component';
import {ComponentFilterComponent} from './component-filter/component-filter.component';
import {ComponentTableComponent} from './component-table/component-table.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, DialogModule, InputSwitchModule, InputTextModule, TriStateCheckboxModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {ComponentColumnComponent} from './component-column/component-column.component';
import {ComponentFormComponent} from './component-form/component-form.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentRoutingModule,
    FormsModule,

    TriStateCheckboxModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    DialogModule,
  ],
  declarations: [
    ComponentListComponent,
    ComponentFilterComponent,
    ComponentTableComponent,
    ComponentColumnComponent,
    ComponentFormComponent,
  ],
})
export class ComponentModule {
}
