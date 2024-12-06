import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.authSubscription = this.authService.authStatus$.subscribe(
      (status) => {
        this.isLoggedIn = status;
      }
    );
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}