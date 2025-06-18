import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripPlannerStore, ViewState } from './store/trip-planner.store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Activity } from '../../models/activity';
import { TagCloudComponent } from "@trippin/ui-components";
import { Router } from '@angular/router';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'trippin-trip-planner',
  imports: [CommonModule, FormsModule, TagCloudComponent],
  templateUrl: './trip-planner.component.html',
  styleUrl: './trip-planner.component.css',
  providers: [TripPlannerStore]
})
export class TripPlannerComponent {

  public ViewState = ViewState;

  tripsPlannerStore = inject(TripPlannerStore);

  httpClient: HttpClient = inject(HttpClient);
  destination: string;
  startDate!: Date;
  endDate!: Date;
  budget!: number;

  private router = inject(Router);
  private tripService = inject(TripsService);

  constructor() {
    this.destination = "";
  }

  ngOnInit() {
  }

  startTripPlanning() {
    this.tripsPlannerStore.setViewState(ViewState.Duration);
  }

  onActivitiesSelected(activities: Activity[]) {
    this.tripsPlannerStore.setSelectedActivites(activities);
  }

  async planTrip() {
    //creat trip in the backend retrieve id
    //pass in the route
    //component should retrieve trip detials ising id


    //TODO fix typing 
    const tripData = await this.tripService.createTrip({
      budget: this.tripsPlannerStore.budget!()!,
      destination: this.tripsPlannerStore.destination!()!,
      endDate: this.tripsPlannerStore.endDate!()!,
      startDate: this.tripsPlannerStore.startDate!()!,
      preferredActivites: this.tripsPlannerStore.activities().map(x => x.name)
    });
    
    window.localStorage.setItem("plan",JSON.stringify(tripData));

    this.router.navigate(['trip'], { queryParams: { 'id': "adfadf" } });
  }

  goToActivities() {
    this.tripsPlannerStore.setTripDetails({
      destination: this.destination,
      startDate: this.startDate,
      endDate: this.endDate,
      budget: this.budget
    });

    this.tripsPlannerStore.navigateToActivites();
  }

}
