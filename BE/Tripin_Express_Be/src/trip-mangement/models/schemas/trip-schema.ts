import { SchemaOptions } from "../../../db/models/schema-options";
import { TripCreationInfo } from "../trip";

export const tripSchemaOptions: SchemaOptions<TripCreationInfo> = {
    schemaInfo: {
        location: {
            type: String,
            required: true
        },
        budget: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        preferredActivities: {
            type: String
        }
    },
    timestamp: true
};
