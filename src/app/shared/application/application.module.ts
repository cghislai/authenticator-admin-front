import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationComponent} from './application/application.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ApplicationComponent],
  exports: [ApplicationComponent],
})
export class ApplicationModule {
}
