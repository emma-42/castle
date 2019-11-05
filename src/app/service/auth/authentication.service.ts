import { SERVICE_URL } from './../../service-url';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/model/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import { Castle } from '@castleio/sdk';
import { EVENTS } from '@castleio/sdk';
declare var _castle: any;
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }
  userLogin(username: string, password: string) {
    const castle = new Castle({ apiSecret: 'wqRiBoXyqfPxKDd7vsoVygrMW2pJdADA' });
    const endPoint = SERVICE_URL.authenticate;
    const clientId = _castle('getClientId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',

      })
    };
    return this.http.post<any>(endPoint, { username, password }, httpOptions)
      .pipe(map(user => {
        if (user && user.token) {
          let response;
          try {
            response = castle.authenticate({
              event: EVENTS.LOGIN_SUCCEEDED,
              user_id: user.firstName,
              user_traits: {
                name: user.firstName,
                email: user.username,
                registered_at: null,
                username: `${user.firstName} ${user.lastName}`
              },
              context: {
                client_id: clientId,
                ip: '37.46.187.90',
                headers: {
                  'User-Agent': navigator.userAgent,
                  Accept: 'text/html',
                  'Accept-Language': 'en-us,en;q=0.5',
                  'Accept-Encoding': 'gzip, deflate, br',
                  Connection: 'Keep-Alive',
                  'Content-Length': '122',
                  'Content-Type': 'application/javascript',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': 'true',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                },
              }
            });
          } catch (e) {
            console.error(e);
          }
          response.then(el => {
            console.log(el.action);
            switch (el.action) {
              case 'allow':
                localStorage.setItem('currentUser', JSON.stringify(user));
                break;
              case 'challenge':
                castle.track(EVENTS.CHALLENGE_REQUESTED, user.id);
                alert('Challenge');
                break;
              case 'deny':
                alert('Denied');
                break;
            }
          });
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  userLogout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  getUser() {
    const endPoint = SERVICE_URL.user;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
      })
    };
    return this.http.get<IUser[]>(endPoint, httpOptions);
  }
}



