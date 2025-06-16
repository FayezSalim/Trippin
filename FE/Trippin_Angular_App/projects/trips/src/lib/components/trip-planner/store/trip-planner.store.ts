import { patchState, signalStore, withMethods, withState, } from '@ngrx/signals';
import {
    withEntities,
} from '@ngrx/signals/entities';
import { Activity } from '../../../models/activity';;
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, throwError } from 'rxjs';
import { TripsService } from '../../../services/trips.service';
import { Trip } from '../../../models/trip';

type tripPlannerInfo = Partial<Pick<Trip, 'budget' | 'destination' | 'endDate' | 'startDate'>>;

export interface TripPlannerStoreState extends tripPlannerInfo {
    viewState: ViewState,
    activities: Activity[];
    possibleActivites: Activity[]
}

export enum ViewState {
    Destination, Duration, Activities, Loading,
}


const initialState: TripPlannerStoreState = {
    viewState: ViewState.Destination,
    activities: [],
    possibleActivites: [],
    budget: undefined,
    destination: undefined,
    endDate: undefined,
    startDate: undefined
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
    withMethods((store, http = inject(HttpClient), tripService = inject(TripsService)) => ({
        setTripDetails(details: Required<tripPlannerInfo>) {
            patchState(store, { ...details });
        },
        setSelectedActivites(selectedActivites: Activity[]) {
            patchState(store, { activities: [...selectedActivites] });
        },
        setViewState(viewState: ViewState) {
            patchState(store, { viewState: viewState });
        },
        navigateToActivites: rxMethod<void>(pipe(
            tap(() => patchState(store, { viewState: ViewState.Loading })),
            switchMap(() => {
                // TODO validation?

                // if (!store.tripPlannerInfo.destination
                //     || !store.tripPlannerInfo.endDate
                //     || !store.tripPlannerInfo.startDate
                //     || !store.tripPlannerInfo.budget) {
                //     return throwError(() => "Required fields not filled");
                // }

                return tripService.getPossibleActivites(
                    {
                        destination: store.destination!()!,
                        endDate: store.endDate!()!,
                        startDate: store.startDate!()!,
                        budget: store.budget!()!
                    });
                // let params = new HttpParams();
                // params = params.set('place', `${store.trip().destination}`);
                // params = params.set('startDate', `${store.trip().startDate?.toString()}`);
                // params = params.set('endDate', `${store.trip().endDate?.toString()}`);
                // return http.get<{ activities: Activity[] }>('http://localhost:3000/ai/todoList', { withCredentials: true, params });
            }),
            tap((possibleActivites) => patchState(store, { possibleActivites: possibleActivites })),
            tap(() => patchState(store, { viewState: ViewState.Activities })),

        )
        )
    }))
);

