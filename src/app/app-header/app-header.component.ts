import {Component, OnInit} from '@angular/core';
import {ProviderInfoService} from '../provider-info.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoggedUserService} from '../logged-user.service';

@Component({
  selector: 'auth-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {

  providerName: Observable<string>;
  loggedUserName: Observable<string>;
  loggedUserIsAdmin: Observable<boolean>;

  constructor(private providerInfoService: ProviderInfoService,
              private loggedUserService: LoggedUserService) {
  }

  ngOnInit() {
    this.providerName = this.providerInfoService.fetchProviderInfo()
      .pipe(map(info => info.name));
    this.loggedUserName = this.loggedUserService.getLoggedUserObservable()
      .pipe(
        map(user => user == null ? null : user.name),
      );
    this.loggedUserIsAdmin = this.loggedUserService.getLoggedUserObservable()
      .pipe(
        map(user => user == null ? false : user.admin),
      );
  }

}
