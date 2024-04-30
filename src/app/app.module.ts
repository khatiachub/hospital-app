import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient,HTTP_INTERCEPTORS, HttpClient, HttpBackend } from '@angular/common/http';
import { AuthInterceptor } from './core/auth-inspector';
import { CategoriesComponent } from './components/categories/categories.component';
import { DoctorDescriptionComponent } from './pages/doctor-description/doctor-description.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { UsersGridComponent } from './pages/users-grid/users-grid.component';
import { EdituserprofileComponent } from './pages/edituserprofile/edituserprofile.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { TranslateModule, TranslateLoader, TranslateService,TranslateCompiler, TranslateParser} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlatpickrModule } from 'angularx-flatpickr';
import {CalendarDateFormatter,CalendarModule,CalendarMomentDateFormatter,DateAdapter,MOMENT,} from 'angular-calendar';
import moment from 'moment';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { CustomDateFormatter } from './components/calendar/custom-date-formatter.provider';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
export function momentAdapterFactory() {
  return adapterFactory(moment);
}
export function translateHttpLoaderFactory(httpBackend: HttpBackend): TranslateHttpLoader {
  return new TranslateHttpLoader(new HttpClient(httpBackend));
}

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    CategoryComponent,
    HeaderComponent,
    FooterComponent,
    CalendarComponent,
    CategoriesComponent,
    DoctorDescriptionComponent,
    AdminPanelComponent,
    UsersGridComponent,
    EdituserprofileComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
        // deps: [HttpBackend],
        // useFactory: translateHttpLoaderFactory
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
    },
    
    }),
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
    {
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass: CalendarMomentDateFormatter,
      },
    },
  )
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    CustomDateFormatter,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(translate: TranslateService) {
  //   translate.setDefaultLang('ka'); 
  //   translate.use('ka');
  // }
 }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
