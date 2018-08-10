import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsUserApplication} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-user-application',
  templateUrl: './user-application.component.html',
  styleUrls: ['./user-application.component.scss'],
})
export class UserApplicationComponent implements OnInit {

  @Input()
  userApplication: WsUserApplication;
  @Input()
  showActive = true;
  @Input()
  showUser = false;
  @Input()
  showApplication = true;
  @Input()
  editable = false;

  @Output()
  activeChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  onActiveChanged(active: boolean) {
    this.activeChange.next(active);
  }
}
