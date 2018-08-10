import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WsUserApplication} from '@charlyghislain/authenticator-api';
import {LoggedUserService} from '../../logged-user.service';
import {Message, MessageService} from 'primeng/api';

@Component({
  selector: 'auth-logged-user-application-list',
  templateUrl: './logged-user-application-list.component.html',
  styleUrls: ['./logged-user-application-list.component.scss'],
})
export class LoggedUserApplicationListComponent implements OnInit {

  @Input()
  header: string;
  @Input()
  editable: boolean;

  userApplications: Observable<WsUserApplication[]>;

  constructor(private loggedUserService: LoggedUserService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.userApplications = this.loggedUserService.getLoggedUserApplicationsObservable();
  }

  onAppRemoveClicked(userApplication: WsUserApplication) {
    this.messageService.add({
      key: 'app-removal',
      data: userApplication,
      sticky: true,
      severity: 'warn',
      summary: 'Are you sure you want to remove this app',
      detail: 'The linked application may remove all your data if you confirm this request.'
        + ' If this is the last application linked to this account, it will be deleted as well',
    });
  }

  onAppRemovalRejected(message: Message) {
    this.messageService.clear('app-removal');
  }

  onAppRemovalConfirmed(message: Message) {
    const app: WsUserApplication = message.data;
    this.messageService.clear('app-removal');
    this.loggedUserService.unlinkApplication(app.applicationId)
      .subscribe(() => this.loggedUserService.refresh());
  }

}
