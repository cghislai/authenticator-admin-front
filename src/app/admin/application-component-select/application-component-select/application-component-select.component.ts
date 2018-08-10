import {Component, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ComponentService} from '../../component/component.service';
import {ComponentFilter, Pagination, WsApplicationComponent} from '@charlyghislain/core-web-api';
import {map} from 'rxjs/operators';

@Component({
  selector: 'auth-application-component-select',
  templateUrl: './application-component-select.component.html',
  styleUrls: ['./application-component-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ApplicationComponentSelectComponent,
    multi: true,
  }],
})
export class ApplicationComponentSelectComponent implements OnInit, ControlValueAccessor {

  disabled: boolean;
  value: WsApplicationComponent;

  suggestions: WsApplicationComponent[] = [];

  private onChangeFunction: Function;
  private onTouchedFunction: Function;

  constructor(private componentService: ComponentService) {
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
    this.value = Object.assign({}, obj);
  }

  search(event: { query: string }) {
    const filter: ComponentFilter = {
      nameContains: event.query,
    };
    const pagination: Pagination = {
      offset: 0,
      length: 10,
    };
    this.componentService.listComponents(filter, pagination)
      .pipe(map(results => results.values))
      .subscribe(results => this.suggestions = results);
  }

  onValueChange(value: WsApplicationComponent) {
    this.value = value;
    this.fireChange(value);
  }

  private fireChange(value: WsApplicationComponent) {
    this.onTouchedFunction();
    this.onChangeFunction(value);
  }
}
