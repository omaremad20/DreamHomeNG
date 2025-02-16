import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/services/Auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  theme: string = 'light';
  currentLang: string = 'en';
  private _AuthService = inject(AuthService) ;
  private _PLATFORM_ID = inject(PLATFORM_ID) ;
  private translate = inject(TranslateService)
  userRole!:string ;
  ngOnInit():void {
    this.userRole = this._AuthService.getRole() !;

        if (isPlatformBrowser(this._PLATFORM_ID)) {
          this.theme = sessionStorage.getItem('theme') || 'light';
          document.documentElement.setAttribute('data-bs-theme', this.theme);
          this.currentLang = sessionStorage.getItem('language') || 'en';
          this.translate.setDefaultLang(this.currentLang);
          this.translate.use(this.currentLang);
        }
      }
      selectedTheme: string = this.theme;
      saveTheme() {
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          this.theme = this.selectedTheme;
          sessionStorage.setItem('theme', this.theme);
          document.documentElement.setAttribute('data-bs-theme', this.theme);
        }
      }
      selectedLang: string = this.currentLang;
      saveLanguage() {
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          this.currentLang = this.selectedLang;
          sessionStorage.setItem('language', this.currentLang);
          this.applyLanguageSettings(this.currentLang);
        }
      }

      private applyLanguageSettings(lang: string) {

        this.translate.use(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      }

      setTheme(selectedTheme: string) {
        this.theme = selectedTheme;
      }


      confirmLogout() {
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          // مسح بيانات المستخدم
          sessionStorage.removeItem('userRole');
          sessionStorage.removeItem('userId');

          // تنفيذ تسجيل الخروج
          this._AuthService.logout();

          // إعادة تحميل الصفحة للرجوع لصفحة تسجيل الدخول
          window.location.reload();
        }
      }
    }


