import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'trippin-trip-timeline',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.css'],
    imports: [CommonModule],
    standalone: true
})
export class TripComponent {
    selectedDay = 0;
    days = [
        {
            date: '24 March',
            sections: [
                {
                    type: 'activity',
                    location: 'History of Physics Museum',
                    mapLink: 'https://maps.google.com/?q=History+of+Physics+Museum',
                    time: '18pm',
                    duration: '1hr',
                    cost: 200,
                    description: 'Explore the wonders of physics through interactive exhibits.',
                    highlights: ['Guided Tour', 'Hands-on Experiments']
                },
                {
                    type: 'meal',
                    location: 'Cafe Relativity',
                    mapLink: 'https://maps.google.com/?q=Cafe+Relativity',
                    time: '19pm',
                    duration: '45min',
                    cost: 350,
                    description: 'Enjoy a themed dinner with science-inspired dishes.',
                    highlights: ['Vegetarian Options', 'Live Music']
                }
            ]
        },
        {
            date: '25 March',
            sections: [
                {
                    type: 'activity',
                    location: 'Quantum Park',
                    mapLink: 'https://maps.google.com/?q=Quantum+Park',
                    time: '10am',
                    duration: '2hr',
                    cost: 0,
                    description: 'Morning walk and group activities in the park.',
                    highlights: ['Yoga', 'Group Games']
                },
                {
                    type: 'highlight',
                    location: 'Einstein Statue',
                    mapLink: 'https://maps.google.com/?q=Einstein+Statue',
                    time: '12pm',
                    duration: '30min',
                    cost: 0,
                    description: 'Photo stop at the famous Einstein Statue.',
                    highlights: ['Photo Opportunity']
                }
            ]
        }
        // Add more days/sections as needed
    ];

    selectDay(idx: number) {
        this.selectedDay = idx;
    }
}