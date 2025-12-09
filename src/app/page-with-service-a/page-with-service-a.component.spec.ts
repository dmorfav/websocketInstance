import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWithServiceAComponent } from './page-with-service-a.component';

describe('PageWithServiceAComponent', () => {
  let component: PageWithServiceAComponent;
  let fixture: ComponentFixture<PageWithServiceAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWithServiceAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWithServiceAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
