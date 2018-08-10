import {Component, Input, OnInit} from '@angular/core';
import {WsApplicationComponentHealth} from '@charlyghislain/core-web-api';

@Component({
  selector: 'auth-application-component-healthcheck-icon',
  templateUrl: './application-component-healthcheck-icon.component.html',
  styleUrls: ['./application-component-healthcheck-icon.component.scss'],
})
export class ApplicationComponentHealthcheckIconComponent implements OnInit {

  @Input()
  set health(value: WsApplicationComponentHealth) {
    this.healthValue = value;
    this.tooltipMessage = this.getTooltipMessage(value);
  }

  healthValue: WsApplicationComponentHealth;
  tooltipMessage: string;

  constructor() {
  }

  ngOnInit() {

  }

  private getTooltipMessage(value: WsApplicationComponentHealth) {
    let message = '';
    if (value.reachable) {
      message += 'Reachable\n';
      if (value.componentHealthy) {
        message += 'Component healthy\n';
      } else {
        message += 'Component unhealthy';
        if (value.componentHealthError != null) {
          message += `: ${value.componentHealthError}`;
        }
        message += '\n';
      }
      if (value.providerAuthorized) {
        message += 'Provider authorized\n';
      } else {
        message += 'Provider authorization error';
        if (value.providerAuthorizationError != null) {
          message += `: ${value.providerAuthorizationError}`;
        }
      }
    } else {
      message += 'Unreachable';
    }
    return message;
  }
}
