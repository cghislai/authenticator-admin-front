import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApplicationColumns} from '../application-column/application-columns';
import {LazyLoadEvent} from 'primeng/api';
import {WsApplication, WsPagination} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-table',
  templateUrl: './application-table.component.html',
  styleUrls: ['./application-table.component.scss'],
})
export class ApplicationTableComponent implements OnInit {

  @Input()
  applications: WsApplication[];
  @Input()
  totalCount: number;
  @Input()
  columns: ApplicationColumns.Column[];
  @Input()
  loading: boolean;
  @Input()
  wsPagination: WsPagination;

  @Output()
  wsPaginationChange = new EventEmitter<LazyLoadEvent>();
  @Output()
  rowClick = new EventEmitter<WsApplication>();

  constructor() {
  }

  ngOnInit() {
  }

  onWsPaginationChange(event: LazyLoadEvent) {
    this.wsPaginationChange.next(event);
  }

  onRowClick(row: WsApplication) {
    this.rowClick.next(row);
  }
}
