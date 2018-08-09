import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagination, WsApplicationComponent} from '@charlyghislain/core-web-api';
import {ComponentColumns} from '../component-column/component-columns';
import {LazyLoadEvent} from 'primeng/api';

@Component({
  selector: 'auth-component-table',
  templateUrl: './component-table.component.html',
  styleUrls: ['./component-table.component.scss'],
})
export class ComponentTableComponent implements OnInit {

  @Input()
  components: WsApplicationComponent[];
  @Input()
  totalCount: number;
  @Input()
  columns: ComponentColumns.Column[];
  @Input()
  loading: boolean;
  @Input()
  pagination: Pagination;

  @Output()
  paginationChange = new EventEmitter<LazyLoadEvent>();
  @Output()
  rowClick = new EventEmitter<WsApplicationComponent>();

  constructor() {
  }

  ngOnInit() {
  }

  onPaginationChange(event: LazyLoadEvent) {
    this.paginationChange.next(event);
  }

  onRowClick(row: WsApplicationComponent) {
    this.rowClick.next(row);
  }
}
