import { SERVICE_URL } from './../../service-url';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const endPoint = SERVICE_URL.base;
    const validURL = request.url.startsWith(endPoint);
    if (isLoggedIn && validURL) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser.token}`
        }
      });
    }
    return next.handle(request);
  }
}
