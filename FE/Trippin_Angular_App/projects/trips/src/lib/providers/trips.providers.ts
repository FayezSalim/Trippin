import { Provider } from "@angular/core";
import { Routes } from "@angular/router";
import { TripPlannerComponent } from "../components/trip-planner/trip-planner.component";
import { AuthGuard } from "@trippin/user-management";
import { TripComponent } from "../components/trip/trip.component";


export function provideTrips(): Provider[] {
    return [];
}

export function provideTripsRoutes(): Routes {
    const routes: Routes = [
        {
            path: 'tripPlanner',
            component: TripPlannerComponent,
            canActivate: [AuthGuard],
        }, {
            path: '',
            component: TripPlannerComponent,
            canActivate: [AuthGuard],
        }, {
            path: 'trip',
            component: TripComponent,
            canActivate: [AuthGuard]
        }
    ];
    return routes;
}