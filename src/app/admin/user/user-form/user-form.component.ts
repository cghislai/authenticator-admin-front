import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UserFormModel} from '../domain/user-form-model';
import {MessageService} from 'primeng/api';
import {UserService} from '../user.service';

@Component({
  selector: 'auth-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: UserFormComponent,
    multi: true,
  }],
})
export class UserFormComponent implements OnInit, ControlValueAccessor {


  model: UserFormModel;
  disabled: boolean;

  @Output()
  cancel = new EventEmitter<any>();
  @Output()
  delete = new EventEmitter<any>();

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
    this.model = Object.assign({}, obj);
  }

  onSubmit() {
    this.onTouchedFunction();
    this.onChangeFunction(this.model);
  }

  onCancel() {
    this.cancel.next(null);
  }

  onDeleteClicked() {
    this.delete.next(null);
  }
}
