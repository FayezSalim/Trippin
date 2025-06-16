export interface Trip {
    tripId: BigInt,
    ownerId: BigInt,
    destination: string,
    startDate: Date,
    endDate: Date,
    preferredActivities: string[]
    totalCost: number,
    budget: number,
    createdAt: Date,
    updatedAt: Date
}