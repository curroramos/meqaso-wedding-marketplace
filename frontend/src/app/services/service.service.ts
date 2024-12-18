import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = 'http://localhost:5000/api/services';

  constructor(private http: HttpClient) {}

  // Fetch details of a specific service
  getServiceDetails(serviceId: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${serviceId}`);
  }
}
