import { patchState, signalStore, withMethods, withState, } from '@ngrx/signals';
import {
    withEntities,
} from '@ngrx/signals/entities';
import { Activity } from '../../../models/activity';;
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
export interface Trip {
    destination?: string;
    activities: Activity[];
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    possibleActivites: Activity[]
};

export interface TripPlannerStoreState {
    viewState: ViewState,
    trip: Trip
}

export enum ViewState {
    Destination, Duration, Activities, Loading,
}



const initialState: TripPlannerStoreState = {
    viewState: ViewState.Destination,
    trip: {
        activities: [],
        possibleActivites: []
    }
}

// export const TripPlannerStore = signalStore(
//     withState(initialState),
//     withEntities<Trip>(),
//     withMethods((store) => ({
//         createNewTrip(place: string, startDate: Date, endDate: Date) {

//         }
//     }))
// );


export const TripPlannerStore = signalStore(
    withState(initialState),
    withMethods((store, http = inject(HttpClient)) => ({
        setTripDetails(details: Partial<Trip>) {
            patchState(store, { trip: { ...details, activities: [], possibleActivites: [] } });
        },
        addActivity(activityToAdd: Activity) {
            patchState(store, {
                trip: {
                    ...store.trip(),
                    activities: [...store.trip().activities, activityToAdd],
                    possibleActivites: [...store.trip().possibleActivites.filter(activity => activity !== activityToAdd)]
                }
            });
        },
        removeActivity(activityToRemove: Activity) {
            patchState(store, {
                trip: {
                    ...store.trip(),
                    activities: store.trip().activities.filter(activity => activity !== activityToRemove),
                    possibleActivites: [...store.trip.possibleActivites(), activityToRemove]
                }
            });
        },
        setViewState(viewState: ViewState) {
            patchState(store, { viewState: viewState });
        },
        navigateToActivites: rxMethod<void>(pipe(
            tap(() => patchState(store, { viewState: ViewState.Loading })),
            switchMap(() => {
                // TODO validation?
                let params = new HttpParams();
                params = params.set('place', `${store.trip().destination}`);
                params = params.set('startDate', `${store.trip().startDate?.toString()}`);
                params = params.set('endDate', `${store.trip().endDate?.toString()}`);
                return http.get<{ activities: Activity[] }>('http://localhost:3000/ai/todoList', { withCredentials: true, params });
            }),
            tap((possibleActivites) => patchState(store, { trip: { ...store.trip(), possibleActivites: possibleActivites.activities }, })),
            tap(() => patchState(store, { viewState: ViewState.Activities }))
        )
        )
    }))
);

