import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { QuickEmail }     from '../models/quick-email';
import { Email }          from '../models/email';
import { Observable }     from 'rxjs/Observable';
import { AlertService }   from '../services/alert.service';
import { BACKEND_API }    from '../config/backendConfig';


@Injectable()

export class CommunicationService {

    constructor(private http: Http, private alertService: AlertService) { }

    sendQuickEmail(email: QuickEmail): Observable<QuickEmail[]> {
        return this.http.post(`${BACKEND_API.quickEmail}`, email)
            .map((response: Response) => response.json())
            .catch((error: any) => {
                this.alertService.error(error.json().message || 'Error sendQuickEmail');
                return Observable.throw(error.json().message || 'Error sendQuickEmail');
            });
    }

    sendEmail(email: Email): Observable<Email[]> {
        return this.http.post(`${BACKEND_API.sendEmail}`, email)
            .map((response: Response) => response.json())
            .catch((error: any) => {
                this.alertService.error(error.json().message || 'Error sendEmail');
                return Observable.throw(error.json().message || 'Error sendEmail');
            });
    }
}
