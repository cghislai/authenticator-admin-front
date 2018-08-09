import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagination, WsKey} from '@charlyghislain/core-web-api';
import {KeyColumns} from '../key-column/key-columns';
import {LazyLoadEvent} from 'primeng/api';

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
  pagination: Pagination;

  @Output()
  paginationChange = new EventEmitter<LazyLoadEvent>();
  @Output()
  rowClick = new EventEmitter<WsKey>();

  constructor() {
  }

  ngOnInit() {
  }

  onPaginationChange(event: LazyLoadEvent) {
    this.paginationChange.next(event);
  }

  onRowClick(row: WsKey) {
    this.rowClick.next(row);
  }
}
