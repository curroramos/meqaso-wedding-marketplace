import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Service } from '../models/service.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = 'http://localhost:5000/api/providers';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProviderProfile(id: string): Observable<User> {
    // Implement this function to access to other profiles
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Fetch the logged-in user's profile
  getMyProfile(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  getUserServices(userId: string): Observable<Service[]> {
    const token = this.authService.getToken();
    console.log(token)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Service[]>(`${this.apiUrl}/profile/${userId}/services`, { headers });
  }
}
