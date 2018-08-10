import {Component, Input, OnInit} from '@angular/core';
import {KeyColumns} from './key-columns';
import {WsKey} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-key-column',
  templateUrl: './key-column.component.html',
  styleUrls: ['./key-column.component.scss'],
})
export class KeyColumnComponent implements OnInit {

  @Input()
  column: KeyColumns.Column;
  @Input()
  value: WsKey;

  constructor() {
  }

  ngOnInit() {
  }

}
