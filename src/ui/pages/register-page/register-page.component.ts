import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {InputTextFieldComponent} from "../../components/inputs/input-text-field/input-text-field.component";
import {FillButtonComponent} from "../../components/buttons/fill-button/fill-button.component";
import {ValidationService} from "../../../services/validation.service";
import {AuthService} from "../../../services/Routes/auth.service";
import {TranslatePipe} from "@ngx-translate/core";
import {AuthModes} from "../../../shared/enums/auth-modes.enum";
import {API_V1_FULL_ENDPOINTS} from "../../../api/v1/endpoints";
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    InputTextFieldComponent,
    FillButtonComponent,
    TranslatePipe
  ],
  templateUrl: './register-page.component.html',
  styleUrl: '../login-page/login-page.component.css'
})
export class RegisterPageComponent {
  @Input() mode: string = '';
  @Input() UUID: string = '';
  @Output() toggleMode = new EventEmitter<void>();
  @Output() toggleConfirmMode = new EventEmitter<void>();
  @Output() setEmail = new EventEmitter<string>();
  @Output() setUUID = new EventEmitter<string>();
  @Output() setUsername = new EventEmitter<string>();
  @Output() setPassword = new EventEmitter<string>();


  username: string = ''
  password: string = ''
  email: string = ''
  constructor(protected validationService: ValidationService, private authService: AuthService) {
  }

  register(){
    if(!this.formValid()){
      return;
    }

    this.confirmEmail();
  }

  formValid(): boolean {
    return this.validationService.validateUsername(this.username) && this.validationService.validatePassword(this.password) && this.mode === AuthModes.LOGIN ? true : this.validationService.validateEmail(this.email);
  }

  confirmEmail(){
    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.setUsername.emit(this.username);
    this.setPassword.emit(this.password);

    this.authService.verifyEmail(data).subscribe({
      next: (response: any) => {
        if (response.UUID) {
          this.setEmail.emit(this.email);
          this.UUID = response.UUID;
          this.setUUID.emit(response.UUID);
          this.mode = AuthModes.CONFIRMCODE;
          this.toggleConfirmMode.emit();
        }
      },
      error: (error) => {
      },
    });
  }

  toggleModeFuncType(){
    this.toggleMode.emit();
  }

  protected readonly API_V1_FULL_ENDPOINTS = API_V1_FULL_ENDPOINTS;
}
