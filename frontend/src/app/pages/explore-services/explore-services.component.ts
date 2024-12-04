import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Service } from '../../models/service.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-explore-services',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './explore-services.component.html',
  styleUrls: ['./explore-services.component.css']
})
export class ExploreServicesComponent implements OnInit {
  services: Service[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  filters = {
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
  };
  currentPage: number = 1;
  totalPages: number = 1;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCategories();
    this.fetchServices();
  }

  fetchCategories() {
    this.http.get<string[]>('http://localhost:5000/api/services/categories').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      },
    });
  }

  fetchServices() {
    console.log('Fetching services with filters:', this.filters);
    this.loading = true;
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('limit', '10');

    if (this.searchQuery.trim()) {
      params = params.set('name', this.searchQuery.trim());
    }

    if (this.filters.category) {
      params = params.set('category', this.filters.category);
    }

    if (this.filters.minPrice !== null && this.filters.minPrice >= 0) {
      params = params.set('minPrice', this.filters.minPrice.toString());
    }

    if (this.filters.maxPrice !== null && this.filters.maxPrice >= 0) {
      params = params.set('maxPrice', this.filters.maxPrice.toString());
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
          console.log('Services fetched successfully:', response.services);
        },
        error: (err) => {
          console.error('Failed to fetch services', err);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  search() {
    console.log('Search triggered with query:', this.searchQuery);
    this.currentPage = 1;
    this.fetchServices();
  }

  applyFilters() {
    console.log('Filters applied:', this.filters);
    this.currentPage = 1;
    this.fetchServices();
  }

  resetFilters() {
    console.log('Filters reset');
    this.filters = { category: '', minPrice: null, maxPrice: null };
    this.searchQuery = '';
    this.currentPage = 1;
    this.fetchServices();
  }

  changePage(page: number) {
    console.log('Page changed to:', page);
    this.currentPage = page;
    this.fetchServices();
  }
}
