import {Component, Input, OnInit} from '@angular/core';
import {WsUser} from '@charlyghislain/core-web-api';
import {LoggedUserService} from '../../logged-user.service';

@Component({
  selector: 'auth-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
})
export class UserInfoFormComponent implements OnInit {

  @Input()
  set user(value: WsUser) {
    this.value = Object.assign({}, value);
  }

  value: WsUser;
  newPassword: string;
  newPasswordConfirm: string;

  constructor(private loggedUserService: LoggedUserService) {
  }

  ngOnInit() {
  }

  updateName(event: any) {
    this.loggedUserService.updateUserName(this.value.name);
  }

  updateEmail(event: any) {
    this.loggedUserService.updateUserMail(this.value.email);
  }

  updatePassword() {
    this.loggedUserService.updateUserPassword(this.newPassword);
  }
}
