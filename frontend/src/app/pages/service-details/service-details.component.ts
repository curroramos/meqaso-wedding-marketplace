import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../models/service.model';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css'],
})
export class ServiceDetailsComponent implements OnInit {
  service: Service | null = null;
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private serviceService: ServiceService
  ) {}

  ngOnInit() {
    console.log('ServiceDetailsComponent initialized');
    const serviceId = this.route.snapshot.paramMap.get('id');
    console.log('Extracted serviceId:', serviceId);

    if (serviceId) {
      this.fetchServiceDetails(serviceId);
      this.fetchReviews(serviceId);
    } else {
      console.error('No serviceId found in route');
    }
  }

  private fetchServiceDetails(serviceId: string) {
    console.log('Fetching service details for serviceId:', serviceId);

    this.serviceService.getServiceDetails(serviceId).subscribe({
      next: (data) => {
        this.service = data;
        console.log('Fetched service details:', data);
      },
      error: (err) => {
        console.error('Error fetching service details:', err);
      },
    });
  }

  private fetchReviews(serviceId: string) {
    console.log('Fetching reviews for serviceId:', serviceId);

    this.reviewService.getReviews(serviceId).subscribe({
      next: (data) => {
        this.reviews = data;
        console.log('Fetched reviews:', data);
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      },
    });
  }
}
