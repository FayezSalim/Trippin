import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { basicTripInfo } from '../models/trip';
import { Activity } from '../models/activity';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private httpClient: HttpClient = inject(HttpClient);

  private serverUrl = 'http://localhost:3000';

  constructor() { }

  async createTrip(tripInfo: basicTripInfo): Promise<any> {
    return lastValueFrom(this.httpClient.post(this.serverUrl + '/trips/trip', tripInfo, { withCredentials: true })).then((x) => x );
  }

  async getPossibleActivites(tripInfo: Omit<basicTripInfo, 'preferredActivites'>): Promise<Activity[]> {
    let params = new HttpParams();
    params = params.set('place', `${tripInfo.destination}`);
    params = params.set('startDate', `${tripInfo.startDate.toString()}`);
    params = params.set('endDate', `${tripInfo.endDate.toString()}`);
    params = params.set('budget', `${tripInfo.budget}`);

    return lastValueFrom(this.httpClient.get<{ activities: Activity[] }>(this.serverUrl + '/ai/todoList', { withCredentials: true, params })).then((x) => x.activities);
  }
}
