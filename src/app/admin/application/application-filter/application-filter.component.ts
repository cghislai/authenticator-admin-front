import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {WsApplicationFilter} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-filter',
  templateUrl: './application-filter.component.html',
  styleUrls: ['./application-filter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: WsApplicationFilterComponent,
    multi: true,
  }],
})
export class WsApplicationFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  value: WsApplicationFilter;
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

  private fireChanges(value: WsApplicationFilter) {
    this.onTouchedFunction();
    this.onChangeFunction(value);
  }

}
