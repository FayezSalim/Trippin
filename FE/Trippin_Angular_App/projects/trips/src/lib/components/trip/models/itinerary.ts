export interface TripItinerary {
    name:      string;
    itinerary: Itinerary[];
}

export interface Itinerary {
    date:       Date;
    activities: Activity[];
}

export interface Activity {
    type:        Type;
    location:    string;
    mapLink:     string;
    time:        Date;
    duration:    number;
    cost:        number;
    description: string;
    highlights:  string[];
}

export enum Type {
    Adventure = "adventure",
    Meal = "meal",
    Visit = "visit",
}
