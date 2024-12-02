import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationBarComponent], // Import NavigationBarComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
})
export class AppComponent {
  title = 'frontend';
}
