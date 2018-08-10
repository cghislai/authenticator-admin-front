import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {KeyService} from '../key.service';
import {WsKey} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-key-form',
  templateUrl: './key-form.component.html',
  styleUrls: ['./key-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: KeyFormComponent,
    multi: true,
  }],
})
export class KeyFormComponent implements OnInit, ControlValueAccessor {

  value: WsKey;
  disabled: boolean;

  publicKey: string;

  @Output()
  cancel = new EventEmitter<any>();

  private onChangeFunction: Function;
  private onTouchedFunction: Function;

  constructor(private keyService: KeyService) {
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

  loadPublicKey() {
    if (this.value == null || this.value.id == null) {
      this.publicKey = null;
      return;
    }
    this.keyService.loadPublicKey(this.value)
      .subscribe(publicKey => this.publicKey = publicKey,
        () => this.publicKey = null);
  }

  onSubmit() {
    this.onTouchedFunction();
    this.onChangeFunction(this.value);
  }

  onCancel() {
    this.cancel.next(null);
  }

}
