import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {publishReplay, refCount, switchMap} from 'rxjs/operators';
import {WsApplicationComponentHealth} from '@charlyghislain/core-web-api';
import {ComponentService} from '../../component/component.service';

@Component({
  selector: 'auth-application-component-healthcheck',
  templateUrl: './application-component-healthcheck.component.html',
  styleUrls: ['./application-component-healthcheck.component.scss'],
})
export class ApplicationComponentHealthcheckComponent implements OnInit {


  @Input()
  set id(value: number) {
    this.idSource.next(value);
  }

  private idSource = new BehaviorSubject<number>(null);

  health: Observable<WsApplicationComponentHealth>;

  constructor(private componentService: ComponentService) {
  }

  ngOnInit() {
    this.health = this.idSource.pipe(
      switchMap(id => this.checkComponentHealth(id)),
      publishReplay(1), refCount(),
    );
  }

  reload(event: Event) {
    this.idSource.next(this.idSource.getValue());
    event.preventDefault();
    event.stopImmediatePropagation();
  }


  private checkComponentHealth(id: number): Observable<WsApplicationComponentHealth> {
    if (id == null) {
      return of(null);
    }
    return this.componentService.checkComponentHealth(id);
  }

}
