import { Component } from '@angular/core';

import { AlertService } from '../../services/alert.service';

@Component({
  moduleId: module.id,
  selector: 'alert',
  templateUrl: 'alert.component.html'
})

export class AlertComponent {
  message: string;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage()
      .subscribe((message: string) => { this.message = message; });
  }
}
