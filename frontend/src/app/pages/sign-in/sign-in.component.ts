import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    console.log('SignInComponent Initialized'); // Log component initialization
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

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

}