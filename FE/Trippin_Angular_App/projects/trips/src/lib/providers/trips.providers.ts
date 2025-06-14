import { Provider } from "@angular/core";
import { Routes } from "@angular/router";
import { TripsComponent } from "../components/trip-planner/trip-planner.component";
import { AuthGuard } from "@trippin/user-management";


export function provideTrips(): Provider[] {
    return [];
}

export function provideTripsRoutes(): Routes {
    const routes: Routes = [
        {
            path: 'trips',
            component: TripsComponent,
            canActivate: [AuthGuard],
        },{
            path:'',
            component: TripsComponent,
            canActivate: [AuthGuard],
        }
    ];
    return routes;
}