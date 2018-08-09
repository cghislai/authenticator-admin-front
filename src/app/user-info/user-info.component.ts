import {Component, OnInit} from '@angular/core';
import {LoggedUserService} from '../logged-user.service';
import {merge, Observable, Subject} from 'rxjs';
import {map, publishReplay, refCount} from 'rxjs/operators';
import {WsUser} from '@charlyghislain/core-web-api';

@Component({
  selector: 'auth-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {

  name: Observable<string>;
  user: Observable<WsUser>;

  private updatedUserSource = new Subject<WsUser>();

  constructor(private loggedUserService: LoggedUserService) {
  }

  ngOnInit() {
    this.user = merge(
      this.loggedUserService.getLoggedUserObservable(),
      this.updatedUserSource,
    )
      .pipe(
        publishReplay(1), refCount(),
      );
    this.name = this.user.pipe(map(u => u.name));
  }

}
