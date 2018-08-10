import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, concat, Observable, of} from 'rxjs';
import {publishReplay, refCount, switchMap} from 'rxjs/operators';
import {ApplicationService} from '../../application/application.service';
import {WsApplicationHealth} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-healthcheck',
  templateUrl: './application-healthcheck.component.html',
  styleUrls: ['./application-healthcheck.component.scss'],
})
export class ApplicationHealthcheckComponent implements OnInit {


  @Input()
  set id(value: number) {
    this.idSource.next(value);
  }

  private idSource = new BehaviorSubject<number>(null);

  health: Observable<WsApplicationHealth>;

  constructor(private applicationService: ApplicationService) {
  }

  ngOnInit() {
    this.health = this.idSource.pipe(
      switchMap(id => this.checkApplicationHealth(id)),
      publishReplay(1), refCount(),
    );
  }

  reload(event: Event) {
    this.idSource.next(this.idSource.getValue());
    event.preventDefault();
    event.stopImmediatePropagation();
  }


  private checkApplicationHealth(id: number): Observable<WsApplicationHealth> {
    if (id == null) {
      return of(null);
    }
    return concat(
      of(null),
      this.applicationService.checkApplicationHealth(id),
    );
  }

}
