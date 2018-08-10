import {Component, Input, OnInit} from '@angular/core';
import {WsApplicationHealth} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-healthcheck-icon',
  templateUrl: './application-healthcheck-icon.component.html',
  styleUrls: ['./application-healthcheck-icon.component.scss'],
})
export class ApplicationHealthcheckIconComponent implements OnInit {

  @Input()
  set health(value: WsApplicationHealth) {
    this.healthValue = value;
    this.tooltipMessage = this.getTooltipMessage(value);
  }

  healthValue: WsApplicationHealth;
  tooltipMessage: string;

  constructor() {
  }

  ngOnInit() {

  }

  private getTooltipMessage(value: WsApplicationHealth): string {
    let message = '';
    if (value == null) {
      return message;
    }
    if (value.reachable) {
      message += 'Reachable\n';
      if (value.applicationHealthy) {
        message += 'Application healthy\n';
      } else {
        message += 'Application unhealthy';
        if (value.applicationHealthError != null) {
          message += `: ${value.applicationHealthError}`;
        }
        message += '\n';
      }
      if (value.authenticatorAuthorized) {
        message += 'Authenticator authorized\n';
      } else {
        message += 'Authenticator authorization error';
        if (value.autenticatorAuthorizationErrors != null) {
          message += `: ${value.autenticatorAuthorizationErrors}`;
        }
      }
    } else {
      message += 'Unreachable';
    }
    return message;
  }
}
