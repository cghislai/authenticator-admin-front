import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagination, WsUser} from '@charlyghislain/core-web-api';
import {UserColumns} from '../user-column/user-columns';
import {LazyLoadEvent} from 'primeng/api';

@Component({
  selector: 'auth-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {

  @Input()
  users: WsUser[];
  @Input()
  totalCount: number;
  @Input()
  columns: UserColumns.Column[];
  @Input()
  loading: boolean;
  @Input()
  pagination: Pagination;

  @Output()
  paginationChange = new EventEmitter<LazyLoadEvent>();
  @Output()
  rowClick = new EventEmitter<WsUser>();

  constructor() {
  }

  ngOnInit() {
  }

  onPaginationChange(event: LazyLoadEvent) {
    this.paginationChange.next(event);
  }

  onRowClick(row: WsUser) {
    this.rowClick.next(row);
  }
}
