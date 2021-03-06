import { Component } from '@angular/core';
import { TranslateService } from '../../../core/@core';
import { CommunicationService } from '../../../core/@core';
import { AlertService } from '../../../core/@core';

declare var grecaptcha: any;

@Component({
    moduleId: module.id,
    templateUrl: 'contact-page.component.html',
    styleUrls: ['contact-page.component.css']
})


export class ContactPageComponent {
    private message: any = {};
    private sendButton: any = {};
    private capchaValid: boolean = false;

    constructor(
        private _translate: TranslateService,
        private communication: CommunicationService,
        private alertService: AlertService
    ) { }

    sendMessage() {
        if (this.capchaValid) {
            this.sendButton = $('#contactForm').find('[type="submit"]')
                .toggleClass('sending').blur();
            this.message.date = new Date();
            this.communication.sendEmail(this.message)
                .subscribe(
                (data: any) => {
                    this.alertService.success('Massage sent successful', true);
                    this.sendButton.removeClass('sending').blur();
                },
                (error: any) => {
                    this.alertService.error(error);
                    this.sendButton.removeClass('sending').blur();
                });
        } else {
            this.alertService.error('Please click on CAPCHA');
        }
    }



    ngOnInit() {
        const context = this;
        $.get('https://ipinfo.io', (response: any) => {
            this.message.ip = response.ip;
        }, 'jsonp');

        function verifyCapcha() {
            context.capchaValid = true;
        }

        grecaptcha.render('contactFormCapcha', {
            'sitekey': '6LcuHwsUAAAAAPkMgMzC04hcsS7LQBBd-0k1JOhN',
            'callback': verifyCapcha,
        });

        $('#contactFormCapcha div').css('margin', 'auto');

        new (<any>Foundation.Abide)($('#contactForm'), {});
        $('#contactForm').on('formvalid.zf.abide', () => this.sendMessage());
    }
}
