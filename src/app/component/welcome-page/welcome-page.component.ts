import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/auth/authentication.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { EVENTS, Castle } from '@castleio/sdk';
declare var _castle: any;

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  user: any;
  constructor(private authenticationService: AuthenticationService, private router: Router) {

    this.user = this.authenticationService.currentUserValue;
  }
  ngOnInit() { }
  logout() {
    const castle = new Castle({ apiSecret: 'wqRiBoXyqfPxKDd7vsoVygrMW2pJdADA' });
    const clientId = _castle('getClientId');
    castle.track({
      event: EVENTS.LOGOUT_SUCCEEDED,
      user_id: this.user.firstName,
      user_traits: {
        name: this.user.firstName,
        email: this.user.username,
        registered_at: null,
        username: `${this.user.firstName} ${this.user.lastName}`
      },
      context: {
        client_id: clientId,
        ip: ' 172.16.0.33',
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
    this.authenticationService.userLogout();
    this.router.navigate(['/login']);
  }
}
