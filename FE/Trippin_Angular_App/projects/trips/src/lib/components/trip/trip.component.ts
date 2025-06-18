import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TripItinerary } from './models/itinerary';

@Component({
    selector: 'trippin-trip-timeline',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.css'],
    imports: [CommonModule],
    standalone: true
})
export class TripComponent {
    selectedDay = 0;

    tripItinerary: TripItinerary

    constructor() {
        //TODO: manage currency units based on local or user currency settings
        //same thing with distance

        this.tripItinerary = JSON.parse(window.localStorage.getItem('plan')!) as TripItinerary;
        this.tripItinerary.itinerary.forEach((day) => {
            day.date = new Date(day.date);
            day.activities.forEach((activity) => {
                activity.time = new Date(activity.time);
            });
        });
    }

    selectDay(idx: number) {
        this.selectedDay = idx;
    }
}