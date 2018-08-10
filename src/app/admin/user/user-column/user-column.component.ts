import {Component, Input, OnInit} from '@angular/core';
import {UserColumns} from './user-columns';
import {WsUser} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-user-column',
  templateUrl: './user-column.component.html',
  styleUrls: ['./user-column.component.scss'],
})
export class UserColumnComponent implements OnInit {

  @Input()
  column: UserColumns.Column;
  @Input()
  value: WsUser;

  constructor() {
  }

  ngOnInit() {
  }

}
