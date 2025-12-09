import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWithGuardComponent } from './page-with-guard.component';

describe('PageWithGuardComponent', () => {
  let component: PageWithGuardComponent;
  let fixture: ComponentFixture<PageWithGuardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWithGuardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWithGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
