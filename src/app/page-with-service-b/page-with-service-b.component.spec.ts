import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWithServiceBComponent } from './page-with-service-b.component';

describe('PageWithServiceBComponent', () => {
  let component: PageWithServiceBComponent;
  let fixture: ComponentFixture<PageWithServiceBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWithServiceBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWithServiceBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
