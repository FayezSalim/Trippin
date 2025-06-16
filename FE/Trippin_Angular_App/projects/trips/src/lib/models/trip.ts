export interface Trip {
    trip_id: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    totalCost: number;
    preferredActivites: string[];
}

export type basicTripInfo = Pick<Trip, 'destination' | 'startDate' | 'endDate' | 'budget' | 'preferredActivites'>;