import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationComponentComponent} from './application-component/application-component.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ApplicationComponentComponent],
  exports: [ApplicationComponentComponent],
})
export class ApplicationComponentModule {
}
