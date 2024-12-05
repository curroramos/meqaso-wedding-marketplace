import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // IMPLEMENT
    // this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
