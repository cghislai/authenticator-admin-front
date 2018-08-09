import {Component, Input, OnInit} from '@angular/core';
import {ComponentColumns} from './component-columns';
import {WsApplicationComponent} from '@charlyghislain/core-web-api';

@Component({
  selector: 'auth-component-column',
  templateUrl: './component-column.component.html',
  styleUrls: ['./component-column.component.scss'],
})
export class ComponentColumnComponent implements OnInit {

  @Input()
  column: ComponentColumns.Column;
  @Input()
  value: WsApplicationComponent;

  constructor() {
  }

  ngOnInit() {
  }

}
