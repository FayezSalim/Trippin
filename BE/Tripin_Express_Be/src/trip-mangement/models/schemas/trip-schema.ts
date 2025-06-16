import { SchemaOptions } from "../../../db/models/schema-options";
import { Trip } from "../trip";

export const tripSchemaOptions: SchemaOptions<Trip> = {
    schemaInfo: {
        tripId: {
            type: BigInt, // Define the column type
            primaryKey: true,        // Mark it as the primary key
            autoIncrement: true,     // Enable auto-increment
            required: true,         // Ensure it cannot be null,
            field: 'trip_id'
        },
        ownerId: {
            type: BigInt, // Define the column type
            required: true,         // Ensure it cannot be null,
            field: 'owner_id'
        },
        destination: {
            type: String,
            required: true
        },
        budget: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true,
            field: 'start_date'
        },
        endDate: {
            type: Date,
            required: true,
            field: 'end_date'
        },
        totalCost: {
            type: Number,
            required: true,
            field: 'total_cost'
        },
    },
    timestamp: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};