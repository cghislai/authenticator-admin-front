import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ApplicationService} from '../application.service';
import {WsApplication} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ApplicationFormComponent,
    multi: true,
  }],
})
export class ApplicationFormComponent implements OnInit, ControlValueAccessor {

  value: WsApplication;
  disabled: boolean;

  applicationSecret: string;
  publicKeyUrl: string;
  publicKey: string;

  @Output()
  cancel = new EventEmitter<any>();

  private onChangeFunction: Function;
  private onTouchedFunction: Function;

  constructor(private applicationService: ApplicationService) {
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
    this.applicationSecret = null;
    this.publicKey = null;
    this.publicKeyUrl = this.applicationService.getPublicKeyUrl(this.value);
  }

  createApplicationSecret() {
    if (this.value == null || this.value.id == null) {
      this.applicationSecret = null;
      return;
    }
    this.applicationService.createApplicationSecret(this.value)
      .subscribe(secret => this.applicationSecret = secret,
        () => this.applicationSecret = null);
  }

  loadPublicKey() {
    if (this.value == null || this.value.id == null) {
      this.publicKey = null;
      return;
    }
    this.applicationService.getPublicKey(this.value)
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
