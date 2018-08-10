import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsApplicationComponent} from '@charlyghislain/core-web-api';
import {ComponentService} from '../component.service';

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

  componentSecret: string;
  publicKeyUrl: string;
  publicKey: string;

  @Output()
  cancel = new EventEmitter<any>();

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
    this.componentSecret = null;
    this.publicKey = null;
    this.publicKeyUrl = this.componentService.getPublicKeyUrl(this.value);
  }

  createComponentSecret() {
    if (this.value == null || this.value.id == null) {
      this.componentSecret = null;
      return;
    }
    this.componentService.createComponentSecret(this.value)
      .subscribe(secret => this.componentSecret = secret,
        () => this.componentSecret = null);
  }

  loadPublicKey() {
    if (this.value == null || this.value.id == null) {
      this.publicKey = null;
      return;
    }
    this.componentService.getPublicKey(this.value)
      .subscribe(key => this.publicKey = key,
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
