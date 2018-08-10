import {Component, OnInit} from '@angular/core';
import {Pagination, UserFilter, WsUser} from '@charlyghislain/core-web-api';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {UserColumns} from '../user-column/user-columns';
import {LazyLoadEvent} from 'primeng/api';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ListResult} from '../../../domain/list-result';
import {UserService} from '../user.service';
import {myThrottleTime} from '../../../utils/throttle-time';

@Component({
  selector: 'auth-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  filter = new BehaviorSubject<UserFilter>(this.createInitialFilter());
  pagination = new BehaviorSubject<Pagination>(this.crateInitialPagination());
  columns = new BehaviorSubject<UserColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsUser[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingUser: WsUser;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    const listResults: Observable<ListResult<WsUser>> = combineLatest(this.filter, this.pagination).pipe(
      debounceTime(0),
      myThrottleTime(1000),
      switchMap(results => this.loadValues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = listResults.pipe(map(results => results.values));
    this.totalCount = listResults.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: UserFilter) {
    this.filter.next(value);
  }

  onPaginationChanged(event: LazyLoadEvent) {
    const newPagination: Pagination = {
      offset: event.first,
      length: event.rows,
    };
    this.pagination.next(newPagination);
  }

  onNewUserClick() {
    this.editingUser = this.userService.createEmptyUser();
  }

  onUserEdited(user: WsUser) {
    this.userService.saveUser(user)
      .subscribe(() => {
        this.editingUser = null;
        this.reload();
      });
  }

  onUserEditCancel() {
    this.editingUser = null;
  }

  onUserSelected(value: WsUser) {
    this.editingUser = value;
  }

  private createInitialFilter(): UserFilter {
    return {};
  }

  private crateInitialPagination(): Pagination {
    return {
      offset: 0,
      length: 50,
    };
  }

  private createInitialColumns(): UserColumns.Column[] {
    return [
      UserColumns.ID,
      UserColumns.NAME,
      UserColumns.EMAIL,
      UserColumns.ACTIVE,
      UserColumns.ADMIN,
      UserColumns.EMAIL_VERIFIED,
      UserColumns.PASSWORD_EXPIRED,
    ];
  }

  private loadValues(filter: UserFilter, pagination: Pagination) {
    this.loading = true;
    return this.userService.listUsers(filter, pagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }
}
