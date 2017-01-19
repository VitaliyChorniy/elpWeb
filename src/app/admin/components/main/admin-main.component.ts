import { Component, OnInit } from '@angular/core';
import { User }              from '../../../core/@core';

@Component({
    moduleId: module.id,
    selector: 'admin-main',
    templateUrl: 'admin-main.component.html'
    styleUrls: ['admin-main.component.css']

})

export class MainAdminComponent implements OnInit {
    private title: string = 'Admin Panel EatLikePro';
    private currentUser: User;

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
}
