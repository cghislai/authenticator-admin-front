import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserColumns} from '../user-column/user-columns';
import {LazyLoadEvent} from 'primeng/api';
import {WsPagination, WsUser} from '@charlyghislain/authenticator-admin-api';

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
  wsPagination: WsPagination;

  @Output()
  wsPaginationChange = new EventEmitter<LazyLoadEvent>();
  @Output()
  rowClick = new EventEmitter<WsUser>();

  constructor() {
  }

  ngOnInit() {
  }

  onWsPaginationChange(event: LazyLoadEvent) {
    this.wsPaginationChange.next(event);
  }

  onRowClick(row: WsUser) {
    this.rowClick.next(row);
  }
}
