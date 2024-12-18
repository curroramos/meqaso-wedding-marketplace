export interface Review {
    id?: string; // Optional MongoDB ObjectId
    serviceId: string; // ID of the service being reviewed
    reviewer: string; // Name or ID of the reviewer
    comment: string; // Text of the review
    rating: number; // Rating given, e.g., 1 to 5
    date: string; // Date when the review was submitted (ISO format)
}