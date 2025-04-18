import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExploreServicesComponent } from './pages/explore-services/explore-services.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ServiceDetailsComponent } from './pages/service-details/service-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'explore', component: ExploreServicesComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'service-details/:id', component: ServiceDetailsComponent },
    { path: '**', redirectTo: '' }
  ];
