import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {UserColumns} from '../user-column/user-columns';
import {LazyLoadEvent, MessageService} from 'primeng/api';
import {debounceTime, delay, map, mergeMap, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {UserService} from '../user.service';
import {myThrottleTime} from '../../../utils/throttle-time';
import {UserFormModel} from '../domain/user-form-model';
import {WsPagination, WsResultList, WsUser, WsUserFilter} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userDeleteConfirmationToastKey = `user-delete-confirmation`;

  filter = new BehaviorSubject<WsUserFilter>(this.createInitialFilter());
  wsPagination = new BehaviorSubject<WsPagination>(this.crateInitialWsPagination());
  columns = new BehaviorSubject<UserColumns.Column[]>(this.createInitialColumns());

  values: Observable<WsUser[]>;
  totalCount: Observable<number>;
  loading: boolean;

  editingUserFormModel: UserFormModel;

  constructor(private userService: UserService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    const wsResultList: Observable<WsResultList<WsUser>> = combineLatest(this.filter, this.wsPagination).pipe(
      debounceTime(0),
      myThrottleTime(1000),
      switchMap(results => this.loadValues(results[0], results[1])),
      publishReplay(1), refCount(),
    );
    this.values = wsResultList.pipe(map(results => results.results));
    this.totalCount = wsResultList.pipe(map(results => results.totalCount));
  }

  onFilterChange(value: WsUserFilter) {
    this.filter.next(value);
  }

  onWsPaginationChanged(event: LazyLoadEvent) {
    const newWsPagination: WsPagination = {
      offset: event.first,
      length: event.rows,
    };
    this.wsPagination.next(newWsPagination);
  }

  onNewUserClick() {
    const newUser = this.userService.createEmptyUser();
    this.editingUserFormModel = this.createFormModel(newUser);
  }

  onUserEdited(model: any) {
    this.saveUserForm(model as UserFormModel)
      .subscribe(() => {
        this.editingUserFormModel = null;
        this.reload();
      });
  }

  onUserEditCancel() {
    this.editingUserFormModel = null;
  }

  onUserSelected(value: WsUser) {
    this.editingUserFormModel = this.createFormModel(value);
  }


  onEditingUserDelete() {
    if (this.editingUserFormModel.newUser) {
      return;
    }
    this.messageService.add({
      summary: 'Are you sure about deleting this user?',
      detail: ` Removing an user is an irreversible action. All applications linked to it will be asked to clear their data.
        You may wish to rather deactivate it, or an application link, in order to prevent future tokens to be signed
        for this user.`,
      key: this.userDeleteConfirmationToastKey,
      sticky: true,
      severity: 'warn',
    });
  }

  onUserDeleteConfirmationRejected() {
    this.messageService.clear(this.userDeleteConfirmationToastKey);
  }

  onUserDeleteConfirmationConfirmed() {
    this.messageService.clear(this.userDeleteConfirmationToastKey);
    this.userService.removeUser(this.editingUserFormModel.user.id).subscribe(
      () => {
        this.editingUserFormModel = null;
        this.reload();
      },
    );
  }


  private createInitialFilter(): WsUserFilter {
    return {};
  }

  private crateInitialWsPagination(): WsPagination {
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
      UserColumns.CREATION_DATE_TIME,
    ];
  }

  private loadValues(filter: WsUserFilter, wsPagination: WsPagination) {
    this.loading = true;
    return this.userService.listUsers(filter, wsPagination).pipe(
      delay(0),
      tap(() => this.loading = false),
    );
  }

  private reload() {
    this.filter.next(this.filter.getValue());
  }

  private createFormModel(user: WsUser): UserFormModel {
    return {
      user: Object.assign({}, user),
      updatePassword: false,
      newPassword: null,
      newUser: user.id == null,
    };
  }

  private saveUserForm(model: UserFormModel): Observable<WsUser> {
    return this.userService.saveUser(model.user)
      .pipe(mergeMap(user => this.setUserPassword(user, model)));
  }

  private setUserPassword(user: WsUser, form: UserFormModel) {
    if (!form.updatePassword) {
      return of(user);
    }
    return this.userService.setUserPassword(user, form.newPassword);
  }
}
