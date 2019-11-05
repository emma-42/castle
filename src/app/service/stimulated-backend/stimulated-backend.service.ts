import { Injectable, ɵConsole } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { IUser } from 'src/app/model/user.model';
import { EVENTS } from '@castleio/sdk';
import { Castle } from '@castleio/sdk';
declare var _castle: any;
@Injectable({
  providedIn: 'root'
})
export class StimulatedBackendService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const users: IUser[] = [
      { id: 1, username: 'jian@castle.io', firstName: 'Emma', lastName: 'Doe', password: '123' },
      { id: 2, username: 'demo@castle.io', firstName: 'Demo', lastName: 'Doe', password: '123' }
    ];
    const clientId = _castle('getClientId');
    const castle = new Castle({ apiSecret: 'wqRiBoXyqfPxKDd7vsoVygrMW2pJdADA' });
    const authHeader = request.headers.get('authorization');
    const isLoggedIn = authHeader && authHeader.startsWith('testing-token');

    return of(null).pipe(mergeMap(() => {

      if (request.url.endsWith('/user/login') && request.method === 'POST') {
        const user = users.find(currentUser => currentUser.username === request.body.username
          && currentUser.password === request.body.password);
        if (!user) {
          return throwError({ status: 400, error: { message: 'Wrong username or password' } });
        }
        const body = {
          id: user.id,
          username: user.username,
          token: `testing-token`,
          firstName: user.firstName,
          lastName: user.lastName
        };
        return of(new HttpResponse({ status: 200, body }));
      }
      if (request.url.endsWith('user') && request.method === 'GET') {
        if (!isLoggedIn) {
          return throwError({ status: 401, error: { message: 'Unauthorized User' } });
        } else {
          return of(new HttpResponse({ status: 200, body: users }));
        }
      }
      return next.handle(request);
    }))
      .pipe(materialize())
      .pipe(delay(300))
      .pipe(dematerialize());
  }
}
