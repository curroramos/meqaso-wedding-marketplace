import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private authStatusSubject: BehaviorSubject<boolean>;
  authStatus$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Initialize the BehaviorSubject with the current token state
    const initialStatus = this.checkToken();
    this.authStatusSubject = new BehaviorSubject<boolean>(initialStatus);
    this.authStatus$ = this.authStatusSubject.asObservable();
  }

  private checkToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.TOKEN_KEY); // Return true if token exists
    }
    return false;
  }

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
    return null;
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.authStatusSubject.next(false); // Notify subscribers
    }
  }

  isLoggedIn(): boolean {
    return this.checkToken();
  }
}
