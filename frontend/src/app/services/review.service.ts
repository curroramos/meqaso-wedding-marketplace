import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:5000/api/reviews';

  constructor(private http: HttpClient) {}

  // Fetch reviews for a specific service
  getReviews(serviceId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${serviceId}`);
  }
}
