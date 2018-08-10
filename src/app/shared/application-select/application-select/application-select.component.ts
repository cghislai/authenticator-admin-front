import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {WsApplication, WsApplicationFilter, WsPagination} from '@charlyghislain/authenticator-admin-api';
import {ApplicationService} from '../../../admin/application/application.service';

@Component({
  selector: 'auth-application-select',
  templateUrl: './application-select.component.html',
  styleUrls: ['./application-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ApplicationSelectComponent,
    multi: true,
  }],
})
export class ApplicationSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled: boolean;

  value = new BehaviorSubject<number>(null);
  applicationValue: Observable<WsApplication>;

  suggestions: WsApplication[] = [];

  private onChangeFunction: Function;
  private onTouchedFunction: Function;

  constructor(private applicationService: ApplicationService) {
    this.applicationValue = this.value.pipe(
      switchMap(id => id == null ? of(null) : this.applicationService.getApplication(id)),
      publishReplay(1), refCount(),
    );
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChangeFunction = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFunction = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.value.next(obj);
  }

  search(event: { query: string }) {
    const filter: WsApplicationFilter = {
      nameContains: event.query,
    };
    const wsPagination: WsPagination = {
      offset: 0,
      length: 10,
    };
    this.applicationService.listApplications(filter, wsPagination)
      .pipe(map(results => results.results))
      .subscribe(results => this.suggestions = results);
  }

  onValueChange(value: WsApplication) {
    this.value.next(value.id);
    this.fireChange(value.id);
  }

  private fireChange(id: number) {
    this.onTouchedFunction();
    this.onChangeFunction(id);
  }
}
