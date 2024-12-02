import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreServicesComponent } from './explore-services.component';

describe('ExploreServicesComponent', () => {
  let component: ExploreServicesComponent;
  let fixture: ComponentFixture<ExploreServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
