import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExploreServicesComponent } from './pages/explore-services/explore-services.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'explore', component: ExploreServicesComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '' }
  ];
