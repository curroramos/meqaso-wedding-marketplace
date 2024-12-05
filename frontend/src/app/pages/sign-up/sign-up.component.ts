import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpService } from '../../services/sign-up.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [SignUpService]
})
export class SignUpComponent {
  signUpForm: FormGroup;
  registrationError: string | null = null;

  constructor(private fb: FormBuilder, private signUpService: SignUpService, private authService:AuthService, private router:Router) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.registrationError = null;
  
      // Call the AuthService to register the user
      this.signUpService.registerUser(this.signUpForm.value).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          this.authService.saveToken(response.token); // Save the token locally
  
          // Navigate to the dashboard page
          this.router.navigate(['/dashboard']).then(() => {
            console.log('Navigated to dashboard');
          });
        },
        error: (err) => { // Renamed 'error' to 'err' to avoid conflict with 'Error'
          console.error('Registration failed:', err);
          this.registrationError = 'Registration failed. Please try again.';
        }
      });
    }
  }
}  
