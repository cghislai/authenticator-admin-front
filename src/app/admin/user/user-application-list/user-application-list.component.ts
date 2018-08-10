import {Component, Input, OnInit} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import {UserService} from '../user.service';
import {distinctUntilChanged, map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {WsResultList, WsUserApplication} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-user-application-list',
  templateUrl: './user-application-list.component.html',
  styleUrls: ['./user-application-list.component.scss'],
})
export class UserApplicationListComponent implements OnInit {

  @Input()
  set userId(value: number) {
    this.userIdSource.next(value);
  }

  @Input()
  header: string;
  @Input()
  editable: boolean;

  private userIdSource = new ReplaySubject<number>(1);

  userApplications: Observable<WsUserApplication[]>;
  totalCount: Observable<number>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    const applicationResults: Observable<WsResultList<WsUserApplication>> = this.userIdSource.pipe(
      distinctUntilChanged(),
      switchMap(id => this.fetchUserApplications(id)),
      publishReplay(1), refCount(),
    );
    this.userApplications = applicationResults.pipe(
      map(results => results.results),
    );
    this.totalCount = applicationResults.pipe(
      map(results => results.totalCount),
    );
  }

  onActiveChanged(userAppplication: WsUserApplication, active: boolean) {
    let updateTask;
    const userId = userAppplication.userId;
    const appId = userAppplication.applicationId;
    if (active) {
      updateTask = this.userService.setUserApplicationActive(userId, appId);
    } else {
      updateTask = this.userService.setUserApplicationInactive(userId, appId);
    }
    updateTask.subscribe(() => {
      this.userIdSource.next(userId);
    });
  }

  private fetchUserApplications(id: number) {
    if (id == null) {
      return of(null);
    }
    return this.userService.listUserAplications(id);
  }
}
