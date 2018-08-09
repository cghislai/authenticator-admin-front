import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsApplicationComponent} from '@charlyghislain/core-web-api';

@Component({
  selector: 'auth-component-form',
  templateUrl: './component-form.component.html',
  styleUrls: ['./component-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ComponentFormComponent,
    multi: true,
  }],
})
export class ComponentFormComponent implements OnInit, ControlValueAccessor {

  value: WsApplicationComponent;
  disabled: boolean;

  @Output()
  cancel = new EventEmitter<any>();

  private onChangeFunction: Function;
  private onTouchedFunction: Function;

  constructor() {
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

  onSubmit() {
    this.onTouchedFunction();
    this.onChangeFunction(this.value);
  }

  onCancel() {
    this.cancel.next(null);
  }
}
