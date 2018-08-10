import {Component, Input, OnInit} from '@angular/core';
import {ApplicationColumns} from './application-columns';
import {WsApplication} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-column',
  templateUrl: './application-column.component.html',
  styleUrls: ['./application-column.component.scss'],
})
export class ApplicationColumnComponent implements OnInit {

  @Input()
  column: ApplicationColumns.Column;
  @Input()
  value: WsApplication;

  constructor() {
  }

  ngOnInit() {
  }

}
