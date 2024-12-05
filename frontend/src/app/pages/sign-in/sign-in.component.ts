import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, GoogleLoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    console.log('SignInComponent Initialized'); // Log component initialization
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Only run this logic in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript();
    }
  }

  // Email/Password Login
  onLogin() {
    console.log('Login Attempt Started'); // Log attempt start
    if (this.loginForm.invalid) {
      console.warn('Login Form Invalid:', this.loginForm.errors); // Log validation issues
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    console.log('Login Payload:', { email }); // Log payload (mask sensitive data)
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login Successful:', response); // Log success response
        const { token } = response; // Extract token from response
        this.authService.saveToken(token); // Save token to localStorage
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login Failed:', error); // Log error details
        this.errorMessage = error.error.message || 'An error occurred during login';
        this.isLoading = false;
      },
    });
  }

  // Google Login
  loadGoogleScript() {
    const scriptId = 'google-identity';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initializeGoogleSignIn();
      document.body.appendChild(script);
    } else {
      this.initializeGoogleSignIn();
    }
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '554289564043-dc2hj6sf47il0emh43mr1de33duph13f.apps.googleusercontent.com', // USE ENV VARIABLE 
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button')!,
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    try {
      // Validate response and ensure credential exists
      if (!response || !response.credential) {
        throw new Error('Invalid Google credential response');
      }
  
      console.log('Google Credential Received:', response.credential);
  
      // Send Google credential (JWT token) to the backend for authentication
      this.authService.googleLogin({ tokenId: response.credential }).subscribe({
        next: (serverResponse: GoogleLoginResponse) => {
          const { token } = serverResponse; // Extract token from response
          this.authService.saveToken(token); // Save token to localStorage
          console.log('Google Login Successful:', serverResponse);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Google Login Failed:', error);
          this.errorMessage = error?.error?.message || 'An error occurred during Google login';
        },
      });
    } catch (error) {
      console.error('Error handling Google credential response:', error);
      this.errorMessage = 'An error occurred during Google login';
    }
  }
}
