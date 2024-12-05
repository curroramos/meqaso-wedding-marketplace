import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SignUpService {
  private apiUrl = 'http://localhost:5000/api/auth/register'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  registerUser(userData: { name: string; email: string; password: string; userType: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }
}
