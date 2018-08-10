import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationComponentSelectComponent} from './application-component-select/application-component-select.component';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    AutoCompleteModule,
  ],
  declarations: [ApplicationComponentSelectComponent],
  exports: [ApplicationComponentSelectComponent],
})
export class ApplicationComponentSelectModule {
}
