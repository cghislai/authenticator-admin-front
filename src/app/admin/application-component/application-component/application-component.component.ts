import {Component, Input, OnInit} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ComponentService} from '../../component/component.service';

@Component({
  selector: 'auth-application-component',
  templateUrl: './application-component.component.html',
  styleUrls: ['./application-component.component.scss'],
})
export class ApplicationComponentComponent implements OnInit {

  @Input()
  set id(value: number) {
    this.idSource.next(value);
  }

  private idSource = new Subject<number>();

  componentName: Observable<string>;

  constructor(private componentService: ComponentService) {
  }

  ngOnInit() {
    this.componentName = this.idSource.pipe(
      switchMap(id => this.fetchComponentName(id)),
    );
  }

  private fetchComponentName(id: number) {
    if (id == null) {
      return of('');
    }
    return this.componentService.getComponent(id)
      .pipe(
        map(c => c.name),
      );
  }
}
