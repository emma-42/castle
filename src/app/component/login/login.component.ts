import { IUser } from './../../model/user.model';
import { AuthenticationService } from './../../service/auth/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EVENTS, Castle } from '@castleio/sdk';
declare var _castle: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  user: IUser =
    { id: 1, username: 'jian@castle.io', firstName: 'Emma', lastName: 'Doe', password: '123' }
    ;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnInit() {
    this.authenticationService.userLogout();
  }

  onSubmit() {
    const castle = new Castle({ apiSecret: 'wqRiBoXyqfPxKDd7vsoVygrMW2pJdADA' });
    const clientId = _castle('getClientId');
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticationService.userLogin(this.loginForm.controls.username.value.trim(), this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        (user) => {
          this.router.navigate(['/']);
        },
        error => {
          castle.track({
            event: EVENTS.LOGIN_FAILED,
            user_id: this.user.firstName,
            user_traits: {
              email: this.user.username,
              registered_at: null,
              username: `${this.user.firstName} ${this.user.lastName}`,
              name: this.user.firstName,
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
          this.error = error;

        });
  }
}
