import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.css']
})

export class AppComponent implements OnInit {

    ngOnInit() {
        $(document).foundation();
    }
}
