import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {KeyColumns} from '../key-column/key-columns';
import {LazyLoadEvent} from 'primeng/api';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';

import {KeyService} from '../key.service';
import {myThrottleTime} from '../../../utils/throttle-time';
import {WsKey, WsKeyFilter, WsPagination, WsResultList} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-key-list',
  templateUrl: './key-list.component.html',
  styleUrls: ['./key-list.component.scss'],
})
export class KeyListComponent implements OnInit {

  filter = new BehaviorSubject<WsKeyFilter>(this.createInitialFilter());
  wsPagination = new BehaviorSubject<WsPagination>(this.crateInitialWsPagination());
  columns = new BehaviorSubject<KeyColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsKey[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingKey: WsKey;

  constructor(private keyService: KeyService) {
  }

  ngOnInit() {
    const wsResultLists: Observable<WsResultList<WsKey>> = combineLatest(this.filter, this.wsPagination).pipe(
      debounceTime(0),
      myThrottleTime(1000),
      switchMap(results => this.loadValues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = wsResultLists.pipe(map(results => results.results));
    this.totalCount = wsResultLists.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: WsKeyFilter) {
    this.filter.next(value);
  }

  onWsPaginationChanged(event: LazyLoadEvent) {
    const newWsPagination: WsPagination = {
      offset: event.first,
      length: event.rows,
    };
    this.wsPagination.next(newWsPagination);
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
    this.editingKey = Object.assign({}, value);
  }

  private createInitialFilter(): WsKeyFilter {
    return {};
  }

  private crateInitialWsPagination(): WsPagination {
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
      KeyColumns.SIGNING_KEY,
      KeyColumns.FOR_APPLICATION_SECRETS,
      KeyColumns.APPLICATION_ID,
      KeyColumns.CREATION_DATE_TIME,
    ];
  }

  private loadValues(filter: WsKeyFilter, wsPagination: WsPagination) {
    this.loading = true;
    return this.keyService.listKeys(filter, wsPagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }
}
