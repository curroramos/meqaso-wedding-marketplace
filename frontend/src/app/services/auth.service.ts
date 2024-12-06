import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$: Observable<boolean> = this.authStatusSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.authStatusSubject.next(true); // Notify subscribers
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null; // Return null if not in browser
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.authStatusSubject.next(false); // Notify subscribers
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
