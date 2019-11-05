import { AuthGuardService } from './service/auth-guard/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './component/welcome-page/welcome-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './component/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { StimulatedBackendService } from './service/stimulated-backend/stimulated-backend.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './service/interceptor/token-interceptor';
import { ErrorInterceptor } from './service/interceptor/error-interceptor';
declare var global: any;
const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: StimulatedBackendService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
