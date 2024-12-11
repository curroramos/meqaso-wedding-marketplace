import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { CommonModule } from '@angular/common';
import { Service } from '../../models/service.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], // Fixed typo
})
export class ProfileComponent implements OnInit {
  userProfile: any = null; // Object to hold user profile data
  errorMessage: string | null = null; // To display any error messages
  userServices: Service[] = []; // Array to hold user's services

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  // Fetch user profile from the API
  fetchUserProfile(): void {
    this.providerService.getMyProfile().subscribe({
      next: (profile) => {
        console.log('API Response:', profile); // Log the entire response
        if (profile && profile.user) {
          this.userProfile = profile.user; // Assuming the API returns { user: { ... } }
          this.fetchUserServices(); // Fetch services only if profile is loaded
        } else {
          console.error('Invalid profile data:', profile);
          this.errorMessage = 'Invalid profile data received from the server.';
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error); // Log the error details
        this.errorMessage = 'Failed to load profile. Please try again later.';
      },
    });
  }

  // Fetch services for the logged-in user
  fetchUserServices(): void {
    if (!this.userProfile || !this.userProfile.id) {
      console.error('User ID is not available.');
      this.errorMessage = 'User profile not loaded. Unable to fetch services.';
      return;
    }

    const userId = this.userProfile.id;

    this.providerService.getUserServices(userId).subscribe({
      next: (services) => {
        console.log('Fetched user services:', services); // Log the fetched services
        if (Array.isArray(services)) {
          this.userServices = services;
        } else {
          console.error('Invalid services data:', services);
          this.errorMessage = 'Invalid services data received from the server.';
        }
      },
      error: (error) => {
        console.error('Error fetching user services:', error); // Log the error details
        this.errorMessage = 'Failed to load services. Please try again later.';
      },
    });
  }
}
