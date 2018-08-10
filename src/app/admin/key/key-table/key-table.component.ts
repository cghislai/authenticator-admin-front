import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeyColumns} from '../key-column/key-columns';
import {LazyLoadEvent} from 'primeng/api';
import {WsKey, WsPagination} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-key-table',
  templateUrl: './key-table.component.html',
  styleUrls: ['./key-table.component.scss'],
})
export class KeyTableComponent implements OnInit {

  @Input()
  keys: WsKey[];
  @Input()
  totalCount: number;
  @Input()
  columns: KeyColumns.Column[];
  @Input()
  loading: boolean;
  @Input()
  wsPagination: WsPagination;

  @Output()
  wsPaginationChange = new EventEmitter<LazyLoadEvent>();
  @Output()
  rowClick = new EventEmitter<WsKey>();

  constructor() {
  }

  ngOnInit() {
  }

  onWsPaginationChange(event: LazyLoadEvent) {
    this.wsPaginationChange.next(event);
  }

  onRowClick(row: WsKey) {
    this.rowClick.next(row);
  }
}
