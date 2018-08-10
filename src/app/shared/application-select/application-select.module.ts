import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationSelectComponent} from './application-select/application-select.component';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    AutoCompleteModule,
  ],
  declarations: [ApplicationSelectComponent],
  exports: [ApplicationSelectComponent],
})
export class ApplicationSelectModule {
}
