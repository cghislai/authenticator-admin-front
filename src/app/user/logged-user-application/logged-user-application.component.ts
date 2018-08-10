import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsUserApplication} from '@charlyghislain/authenticator-api';

@Component({
  selector: 'auth-logged-user-application',
  templateUrl: './logged-user-application.component.html',
  styleUrls: ['./logged-user-application.component.scss'],
})
export class LoggedUserApplicationComponent implements OnInit {

  @Input()
  userApplication: WsUserApplication;
  @Input()
  showActions = true;

  @Output()
  removeClick = new EventEmitter<any>();


  constructor() {
  }

  ngOnInit() {
  }

  onRemoveClicked() {
    this.removeClick.next(true);
  }

}
