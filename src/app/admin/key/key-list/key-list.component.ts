import {Component, OnInit} from '@angular/core';
import {KeyFilter, Pagination, WsKey} from '@charlyghislain/core-web-api';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {KeyColumns} from '../key-column/key-columns';
import {LazyLoadEvent} from 'primeng/api';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ListResult} from '../../../domain/list-result';
import {KeyService} from '../key.service';
import {myThrottleTime} from '../../../utils/throttle-time';

@Component({
  selector: 'auth-key-list',
  templateUrl: './key-list.component.html',
  styleUrls: ['./key-list.component.scss'],
})
export class KeyListComponent implements OnInit {

  filter = new BehaviorSubject<KeyFilter>(this.createInitialFilter());
  pagination = new BehaviorSubject<Pagination>(this.crateInitialPagination());
  columns = new BehaviorSubject<KeyColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsKey[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingKey: WsKey;

  constructor(private keyService: KeyService) {
  }

  ngOnInit() {
    const listResults: Observable<ListResult<WsKey>> = combineLatest(this.filter, this.pagination).pipe(
      debounceTime(0),
      myThrottleTime(1000),
      switchMap(results => this.loadValues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = listResults.pipe(map(results => results.values));
    this.totalCount = listResults.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: KeyFilter) {
    this.filter.next(value);
  }

  onPaginationChanged(event: LazyLoadEvent) {
    const newPagination: Pagination = {
      offset: event.first,
      length: event.rows,
    };
    this.pagination.next(newPagination);
  }

  onNewKeyClick() {
    this.editingKey = this.keyService.createEmptyKey();
  }

  onKeyEdited(key: WsKey) {
    this.keyService.saveKey(key)
      .subscribe(() => {
        this.editingKey = null;
        this.reload();
      });
  }

  onKeyEditCancel() {
    this.editingKey = null;
  }

  onKeySelected(value: WsKey) {
    this.editingKey = value;
  }

  private createInitialFilter(): KeyFilter {
    return {};
  }

  private crateInitialPagination(): Pagination {
    return {
      offset: 0,
      length: 50,
    };
  }

  private createInitialColumns(): KeyColumns.Column[] {
    return [
      KeyColumns.ID,
      KeyColumns.NAME,
      KeyColumns.ACTIVE,
      KeyColumns.FOR_APPLICATION_SECRETS,
      KeyColumns.COMPONENT_ID,
      KeyColumns.CREATION_DATE_TIME,
    ];
  }

  private loadValues(filter: KeyFilter, pagination: Pagination) {
    this.loading = true;
    return this.keyService.listKeys(filter, pagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }
}
