import {Component, OnInit} from '@angular/core';
import {AuthResponse} from '../../utils/model/rest/auth/AuthResponseModels';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbSpinnerModule
} from '@nebular/theme';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../../utils/service/auth.service';
import {Router} from '@angular/router';
import {AuthRequest} from '../../utils/model/rest/auth/AuthRequestModels';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-login-page',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        NbLayoutModule,
        NbSpinnerModule,
        TranslatePipe,
        NbFormFieldModule,
        NbIconModule
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  loginResponse!: AuthResponse;
  loginMessage!: string;
  isSubmitted: boolean = false;
  labelInit: boolean = false;
  showSpinner: boolean = false;
  showPassword = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    readonly authService: AuthService,
    readonly router: Router,
  ) {
  }


  ngOnInit(): void {

  }

  login() {

    if (this.loginForm.valid) {
      this.showSpinner = true;

      const loginRequest: AuthRequest = {
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value
      }

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.loginResponse = response.data;
          this.showSpinner = false;
          this.router.navigate(['pages']).then(r =>
            console.log('Navigated to dashboard'));
        },
        error: (error: HttpErrorResponse) => {
          this.showSpinner = false;
          if (error.status === 401) {
            this.loginMessage = 'error.login.invalid';
            return;
          } else if (error.status === 403) {
            this.loginMessage = 'error.login.forbidden';
          }
          this.loginMessage = 'error.login.unknown';
        },
        complete: () => {
          this.showSpinner = false;
        }
      })
    }
  }

  handleKeyUp(event: any): void {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
