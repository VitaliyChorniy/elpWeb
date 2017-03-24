import { Injectable, OnInit }                       from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Subject }                                  from 'rxjs/Subject';
import { Observable }                               from 'rxjs/Observable';
import { AlertService }                             from '../services/alert.service';
import { User }                                     from '../models/user';
import { ADMIN_EMAILS }                             from '../config/admins';
import { BACKEND_API }                              from '../config/backendConfig';
import { LoggedService }                            from '../services/logged.service';
import { Logged }                                   from '../definitions/logged';
import { SessionService }                           from '../services/session.service';

@Injectable()
export class UserService implements OnInit {
    private subject: Subject<{}> = new Subject<{}>();
    private user: User;
    private coords: any;
    private adminEmails: any = ADMIN_EMAILS;
    private logged: Logged;

    constructor(
      private http: Http,
      private alertService: AlertService,
      private loggedService: LoggedService,
      private sessionService: SessionService) { }

    ngOnInit() {
        window.navigator.geolocation.getCurrentPosition(position => {
            this.coords = position.coords;
        });
    }

    private isAdmin(userData: any) {
        return this.adminEmails.indexOf(userData.email) !== -1;
    }

    public getAll() {
        return this.http.get(BACKEND_API.getAllUsers, this.sessionService.addTokenHeader())
            .map((response: Response) => response.json())
            .catch((error: any) => {
                this.alertService.error(error || 'Error getAll users');
                return Observable.throw(error || 'Error getAll users');
            });
    }

    public getById(id: any) {
        return this.http.get(BACKEND_API.getUserById + id, this.sessionService.addTokenHeader())
            .map((response: Response) => response.json())
            .catch((error: any) => {
                this.alertService.error(error || 'Error getById users');
                return Observable.throw(error || 'Error getById users');
            });
    }

    public isRegistered(userData: any) {
      return this.http.get(BACKEND_API.isRegistered, this.sessionService.addTokenHeader())
          .map((response: Response) => response.json())
          .catch((error: any) => {
              this.alertService.error(error.json().message || 'Error isRegistered');
              return Observable.throw(error.json().message || 'Error isRegistered');
          });
    }

    public create(userData: any) {
        this.user = new User({
            password: userData.password,
            firstName: userData.firstName || userData.first_name,
            lastName: userData.lastName || userData.last_name,
            type: this.isAdmin(userData) ? 'admin' : 'default',
            email: userData.email,
            registrationType: userData.registrationType,
            registrationTime: new Date(),
            image: userData.image,
            location: this.coords
        });

        return this.http.post(BACKEND_API.signup, this.user)
            .map((response: Response) => {

                if (response.status === 200) {
                  let user = response.json().user;
                  let token = response.json().token;

                  if (user && token) {
                      // store user details and jwt token in local storage
                      // to keep user logged in between page refreshes
                      localStorage.setItem('currentUser', JSON.stringify(user));
                      localStorage.setItem('sessionToken', JSON.stringify(token));
                      this.logged = {
                          email: user.email,
                          firstName: user.firstName
                      };
                      this.loggedService.setLogged(this.logged);
                  }

                  this.subject.next(status);
                }
                return response;



            })
            .catch((error: any) => {
                this.alertService.error(error.json().message || error.json().errmsg  || 'Error create user');
                return Observable.throw(error.json().message || error.json().errmsg  || 'Error create user');
            });
    }

    public registerationSuccess(): Observable<{}> {
        return this.subject.asObservable();
    }

    public update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.sessionService.addTokenHeader())
            .map((response: Response) => response.json())
            .catch((error: any) => {
                this.alertService.error(error || 'Error update users');
                return Observable.throw(error || 'Error update users');
            });
    }

    public delete(id: any) {
        return this.http.delete(BACKEND_API.deleteUser + id, this.sessionService.addTokenHeader())
            .map((response: Response) => response.json())
            .catch((error: any) => {
                this.alertService.error(error || 'Error delete users');
                return Observable.throw(error || 'Error delete users');
            });
    }
}
