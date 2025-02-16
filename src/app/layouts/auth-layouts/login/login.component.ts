import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Login } from '../../../core/interfaces/login';
import { LoginService } from '../../../core/services/login.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/Auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit , OnDestroy {
  private _AuthService = inject(AuthService);
  private _LoginService = inject(LoginService);
  private _TranslateService = inject(TranslateService);
  private _Router = inject(Router);
  loginError!:boolean ;
  isLoading:boolean = false ;
  callingForm: Subscription | null = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  loginData!: Login;
  loginFormData: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, ])
  });
  showModal: boolean = false;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDirection();
      this._TranslateService.onLangChange.subscribe(() => {
        this.updateDirection();
      });
    }
  }
  updateDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentLang = this._TranslateService.currentLang || 'en';
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }
  sumbited!:boolean ;
  showLoginData(): void {
    this.sumbited = true ;
    this.isLoading = true ;
    if (this.loginFormData.valid) {
      this.callingForm = this._LoginService.login(this.loginFormData.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          console.log(response.user._id) ;
          this._AuthService.login(response.user._id ,  response.user.role);
          this.loginFormData.reset() ;
          this.showModal = true;
          this.isLoading = false ;
          this.loginError = false ;
        },
        error: (err) => {
          if (err?.error?.message === 'Check your email and password') {
            this.loginError = true ;
            this.isLoading = false ;
          }
        }
      })??null;
    } else {
      this.loginFormData.markAllAsTouched() ;
    }
  }
  closeModal(): void {
    this.showModal = false;
    this._Router.navigate(['/dreamhome']);
  }
passwordVisible:boolean = false;
togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}
  ngOnDestroy(): void {
    if(this.callingForm) {
      this.callingForm.unsubscribe() ;
      this.callingForm = null ;
      console.log('login destoried');
    }
  }
}
