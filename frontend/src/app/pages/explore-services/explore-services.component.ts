import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Service } from '../../models/service.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxSliderModule, ChangeContext } from '@angular-slider/ngx-slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-explore-services',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxSliderModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    RouterModule
  ],
  templateUrl: './explore-services.component.html',
  styleUrls: ['./explore-services.component.css']
})
export class ExploreServicesComponent implements OnInit {
  services: Service[] = [];
  categories: string[] = [];
  selectedCategories: { [key: string]: boolean } = {};
  searchQuery: string = '';
  filters = {
    categories: [] as string[],
    minPrice: 0,
    maxPrice: 1000,
  };

  // Explicit properties for binding
  minPrice: number = 0;
  maxPrice: number = 1000;

  sliderOptions = {
    floor: 0,
    ceil: 1000,
    step: 10,
    noSwitching: true,
  };

  currentPage: number = 1;
  totalPages: number = 1;
  loading: boolean = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.fetchCategories();
    this.fetchServices();
  }

  onPriceChange(changeContext: ChangeContext) {
    console.log('Price range changed:', this.minPrice, this.maxPrice);
    this.filters.minPrice = this.minPrice;
    this.filters.maxPrice = this.maxPrice;
    this.applyFilters();
  }

  onCategoryChange(category: string, event: any) {
    this.selectedCategories[category] = event.checked;
    this.updateCategoryFilters();
    this.applyFilters();
  }
  
  updateCategoryFilters() {
    this.filters.categories = Object.keys(this.selectedCategories).filter(
      (key) => this.selectedCategories[key]
    );
  
    console.log(this.filters.categories);
  }

  fetchCategories() {
    this.http.get<string[]>('http://localhost:5000/api/services/categories').subscribe({
      next: (data) => {
        this.categories = data;
        this.categories.forEach((category) => {
          this.selectedCategories[category] = false;
        });
      },
      error: (err) => console.error('Failed to fetch categories', err),
    });
  }

  fetchServices() {
    this.loading = true;
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('limit', '10')
      .set('minPrice', this.filters.minPrice.toString())
      .set('maxPrice', this.filters.maxPrice.toString());

    if (this.searchQuery.trim()) {
      params = params.set('name', this.searchQuery.trim());
    }

    if (this.filters.categories.length > 0) {
      params = params.set('categories', JSON.stringify(this.filters.categories));
    }

    this.http
      .get<{ services: Service[]; totalPages: number }>(
        'http://localhost:5000/api/services',
        { params }
      )
      .subscribe({
        next: (response) => {
          this.services = response.services;
          this.totalPages = response.totalPages;
        },
        error: (err) => console.error('Failed to fetch services', err),
        complete: () => (this.loading = false),
      });
  }

  search(){
    this.applyFilters()
  }

  applyFilters() {
    this.currentPage = 1;
    this.fetchServices();
  }

  resetFilters() {
    this.selectedCategories = {};
    this.filters = { categories: [], minPrice: 0, maxPrice: 1000 };
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.searchQuery = '';
    this.currentPage = 1;
    this.fetchServices();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.fetchServices();
  }
  
}