import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {KeyFilter} from '@charlyghislain/core-web-api';

@Component({
  selector: 'auth-key-filter',
  templateUrl: './key-filter.component.html',
  styleUrls: ['./key-filter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: KeyFilterComponent,
    multi: true,
  }],
})
export class KeyFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  value: KeyFilter;
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

  private fireChanges(value: KeyFilter) {
    this.onTouchedFunction();
    this.onChangeFunction(value);
  }

}
