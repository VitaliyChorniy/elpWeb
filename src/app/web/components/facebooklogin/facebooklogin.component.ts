import { Component }             from '@angular/core';
import { AuthenticationService } from '../../../core/@core';
import { UserService }           from '../../../core/@core';
import { AlertService }          from '../../../core/@core';

declare const FB: any;

@Component({
    moduleId: module.id,
    selector: 'facebook-login',
    templateUrl: 'facebooklogin.component.html',
    styleUrls: ['facebooklogin.component.css']
})

export class FacebookLoginComponent {
    private showSelf: boolean;
    private loginButton: any;
    private appId: string;

    constructor(
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService
    ) {
        if (window.location.hostname !== 'localhost') {
            this.appId = '954999384605058';
        } else {
            this.appId = '955002201271443';
        }
        try {
            FB.init({
                appId: this.appId,
                cookie: false,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.5' // use graph api version 2.5
            });
            this.showSelf = true;
        } catch (err) {
            this.showSelf = false;
            console.warn('error loading Facebook', err);
        }
    }

    tryRegisterUser(response: any) {
        response.registrationType = 'facebook';
        this.userService.signup(response)
            .subscribe(
            (data: any) => {
                // set success message and pass true paramater
                // to persist the message after redirecting to the login page
                this.loginButton.removeClass('sending').blur();
                this.alertService.success('Registration successful', true);
            },
            (error: any) => {
                this.loginButton.removeClass('sending').blur();
                this.alertService.error(error.message);
            });
    }

    loginInApp(user: any) {
        this.authenticationService.login(user.email, user.password)
            .subscribe(
            (data: any) => {
                this.alertService.success('Login successful', true);
                this.loginButton.removeClass('sending').blur();
            },
            (error: any) => {
                if (error.userRegistered) {
                    this.alertService.error('User Already registred with Google or Email');
                    this.loginButton.removeClass('sending').blur();
                } else {
                    this.tryRegisterUser(user);
                }
            });
    }

    getUserDataOnLogin () {
        FB.api('/me', {
            locale: 'en_US',
            fields: 'first_name,last_name,email,location,picture'
        }, (response: any) => {
            // Idea is to save FB id as user password
            response.password = response.id;
            response.image = response.picture.data.url;
            this.loginInApp(response);
        });
    }

    onFacebookLoginClick(event: any) {
        event.preventDefault();
        this.loginButton = $('#facebook-login').toggleClass('sending').blur();
        FB.login((response: any) => {
            if (response.authResponse) {
                this.getUserDataOnLogin();
            } else {
                console.warn('User cancelled login or did not fully authorize.');
                this.loginButton.removeClass('sending').blur();
            }
        }, { scope: 'email,user_location', return_scopes: true });
    }
}
