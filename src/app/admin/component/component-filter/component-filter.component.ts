import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {WsComponentFilter} from '@charlyghislain/core-web-api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'auth-component-filter',
  templateUrl: './component-filter.component.html',
  styleUrls: ['./component-filter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: WsComponentFilterComponent,
    multi: true,
  }],
})
export class WsComponentFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  value: WsComponentFilter;
  disabled: boolean;

  private onChangeFunction: Function;
  private onTouchedFunction: Function;
  private subscription: Subscription;

  @ViewChild('form')
  private form: NgForm;

  constructor() {
  }

  ngOnInit() {
    this.subscription = this.form.form.valueChanges.subscribe(v => this.fireChanges(v));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  private fireChanges(value: WsComponentFilter) {
    this.onTouchedFunction();
    this.onChangeFunction(value);
  }

}
