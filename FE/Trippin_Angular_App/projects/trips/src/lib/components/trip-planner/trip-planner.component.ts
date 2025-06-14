import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripPlannerStore, ViewState } from './store/trip-planner.store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Activity } from '../../models/activity';

@Component({
  selector: 'trippin-trip-planner',
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-planner.component.html',
  styleUrl: './trip-planner.component.css',
  providers: [TripPlannerStore],
  animations: [
    // trigger('fadeInOut', [
    //   transition(':enter', [
    //     style({ opacity: 0 }),
    //     animate('400ms', style({ opacity: 1 }))
    //   ]),
    //   transition(':leave', [
    //     animate('400ms', style({ opacity: 0 }))
    //   ])
    // ])
  ]
})
export class TripsComponent {
  //TODO move states to component store
  // showBasics = false;
  // swipeLeft = false;
  // swipeLeftBasics = false;
  // loading = false;
  // allActivites:Activity[] 

  // All activities
  // allActivities = [
  //   { label: 'Hiking', icon: '🥾' },
  //   { label: 'Museum', icon: '🏛️' },
  //   { label: 'Beach', icon: '🏖️' },
  //   { label: 'Food', icon: '🍽️' },
  //   { label: 'Shopping', icon: '🛍️' },
  //   { label: 'Nightlife', icon: '🎉' },
  //   { label: 'Cycling', icon: '🚴' },
  //   { label: 'Photography', icon: '📷' },
  //   { label: 'Art', icon: '🎨' },
  //   { label: 'Music', icon: '🎵' },
  //   { label: 'Nature', icon: '🌲' },
  //   { label: 'History', icon: '📜' }
  // ];

  // Fixed non-overlapping positions
  tagPositions = [
    { top: '10%', left: '15%' },
    { top: '30%', left: '60%' },
    { top: '60%', left: '25%' },
    { top: '50%', left: '70%' },
    { top: '75%', left: '40%' },
    { top: '20%', left: '80%' },
    { top: '65%', left: '10%' },
    { top: '80%', left: '60%' }
  ];

  public ViewState = ViewState;

  visibleTags: any[] = [];
  hiddenTags: any[] = [];
  selectedTags: any[] = [];
  tagsPerPage = 4;

  // trip = {
  //   city: '',
  //   startDate: '',
  //   endDate: '',
  //   budget: null
  // };

  tripsPlannerStore = inject(TripPlannerStore);

  httpClient: HttpClient = inject(HttpClient);
  destination: string;
  startDate!: Date;
  endDate!: Date;
  budget!: number;

  constructor() {
    //this.allActivites = [];
    this.destination = "";

    effect(() => {
      const possibleActivites = this.tripsPlannerStore.trip().possibleActivites;
      if (possibleActivites.length <= 0) {
        return;
      }
      this.showActivities(possibleActivites)
    });
  }

  ngOnInit() {
  }

  showActivities(possibleActivites: Activity[]) {
    // Clone and shuffle activities
    const shuffled = possibleActivites.sort(() => Math.random() - 0.5);
    this.hiddenTags = shuffled.map((tag, i) => ({
      ...tag,
      ...this.tagPositions[i % this.tagPositions.length],
      key: `${tag.name}-${i}`,
      visible: false
    }));

    this.selectedTags = [];
    this.visibleTags = [];
    // Show first N tags
    for (let i = 0; i < this.tagsPerPage && this.hiddenTags.length > 0; i++) {
      const tag = this.hiddenTags.shift();
      tag.visible = true;
      this.visibleTags.push(tag);
    }

    //this.showActivities = true;
  }

  startTripPlanning() {
    //this.swipeLeft = true;

    //this.tripsStore.createNewTrip()


    // setTimeout(() => {
    //   this.showBasics = true;
    // }, 500);

    // TODO valiation for destination
    this.tripsPlannerStore.setViewState(ViewState.Duration);
  }

  goToActivities() {
    // this.swipeLeftBasics = true;
    // this.loading = true;

    this.tripsPlannerStore.setTripDetails({
      destination: this.destination,
      startDate: this.startDate,
      endDate: this.endDate,
      budget: this.budget
    });

    this.tripsPlannerStore.navigateToActivites();

    // let params = new HttpParams();
    // params = params.set('place', `${this.trip.city}`);
    // params = params.set('startDate', `${this.trip.startDate.toString()}`);
    // params = params.set('endDate', `${this.trip.endDate.toString()}`);

    // this.httpClient.get('http://localhost:3000/ai/todoList', { withCredentials: true, params }).subscribe((res) => {
    //   console.log(res);
    //   setTimeout(() => {
    //     this.showActivities();
    //     this.loading = false;
    //   }, 500);
    // }, () => {
    //   // In case of error, hide spinner
    //   this.loading = false;
    // });
  }

  toggleTag(tag: any, fromSelected = false) {
    if (fromSelected) {
      // Remove from selectedTags
      this.selectedTags = this.selectedTags.filter(t => t.key !== tag.key);
      // Add back to hiddenTags
      this.hiddenTags.push(tag);
      // If visibleTags has less than tagsPerPage, show this tag
      if (this.visibleTags.length < this.tagsPerPage) {
        const newTag = this.hiddenTags.shift();
        if (newTag) {
          newTag.visible = true;
          this.visibleTags.push(newTag);
        }
      }
    } else {
      // Fade out the tag
      tag.visible = false;
      setTimeout(() => {
        // Remove from visibleTags
        this.visibleTags = this.visibleTags.filter(t => t.key !== tag.key);
        // Add to selected
        this.selectedTags.push(tag);
        // Add a new tag if available
        if (this.hiddenTags.length > 0) {
          const newTag = this.hiddenTags.shift();
          newTag.visible = true;
          this.visibleTags.push(newTag);
        }
      }, 400); // Match fade out duration
    }
  }

  toggleViewState(viewState: ViewState) {

  }
}
