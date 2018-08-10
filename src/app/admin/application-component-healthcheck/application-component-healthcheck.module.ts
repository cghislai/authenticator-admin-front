import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationComponentHealthcheckComponent} from './application-component-healthcheck/application-component-healthcheck.component';
import {ApplicationComponentHealthcheckIconComponent} from './application-component-healthcheck-icon/application-component-healthcheck-icon.component';
import {TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,

    TooltipModule,
  ],
  declarations: [ApplicationComponentHealthcheckComponent, ApplicationComponentHealthcheckIconComponent],
  exports: [ApplicationComponentHealthcheckComponent],
})
export class ApplicationComponentHealthcheckModule {
}
