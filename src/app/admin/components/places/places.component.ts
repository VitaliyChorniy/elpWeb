import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Place } from '../../../core/@core';
import { PlaceService } from '../../../core/@core';

@Component({
    moduleId: module.id,
    selector: 'my-places',
    templateUrl: 'places.component.html',
    providers: [PlaceService]
})

export class PlacesComponent implements OnInit {
    places: Place[];
    selectedPlace: Place;
    currentPopUp: any;
    currentUser: any;

    constructor(
        private placeService: PlaceService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.getPlaces();
    }

    private getPlaces(): void {
        this.placeService.getAllForUser()
            .subscribe((places: Place[]) => this.places = places);
    }

    openConfirmPopUp() {
        this.currentPopUp.open();
    }

    onSelect(place: Place): void {
        this.currentPopUp = new (<any>Foundation.Reveal)($('#deleteModal'));
        this.selectedPlace = place;
    }

    gotoDetail(place: Place): void {
        let link = ['/admin/place-detail', place._id];
        this.router.navigate(link);
    }

    delete(place: Place): void {
        this.placeService
            .delete(place._id)
            .subscribe(() => {
                this.places = this.places.filter(h => h !== place);
                if (this.selectedPlace === place) { this.selectedPlace = null; }
            });
    }

}
