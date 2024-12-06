import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; // Assume this is where the interface is stored
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = 'https://localhost:5000/api/providers';

  constructor(private http: HttpClient) {}

  getProviderProfile(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
