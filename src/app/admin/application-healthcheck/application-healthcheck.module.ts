import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationHealthcheckComponent} from './application-healthcheck/application-healthcheck.component';
import {TooltipModule} from 'primeng/primeng';
import {ApplicationHealthcheckIconComponent} from './application-healthcheck-icon/application-healthcheck-icon.component';

@NgModule({
  imports: [
    CommonModule,

    TooltipModule,
  ],
  declarations: [ApplicationHealthcheckComponent, ApplicationHealthcheckIconComponent],
  exports: [ApplicationHealthcheckComponent],
})
export class ApplicationHealthcheckModule {
}
