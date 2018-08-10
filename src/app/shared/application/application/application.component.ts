import {Component, Input, OnInit} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ApplicationService} from '../../../admin/application/application.service';

@Component({
  selector: 'auth-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {

  @Input()
  set id(value: number) {
    this.idSource.next(value);
  }

  private idSource = new ReplaySubject<number>(1);

  applicationName: Observable<string>;

  constructor(private applicationService: ApplicationService) {
  }

  ngOnInit() {
    this.applicationName = this.idSource.pipe(
      switchMap(id => this.fetchComponentName(id)),
    );
  }

  private fetchComponentName(id: number) {
    if (id == null) {
      return of('');
    }
    return this.applicationService.getApplication(id)
      .pipe(
        map(c => c.name),
      );
  }
}
