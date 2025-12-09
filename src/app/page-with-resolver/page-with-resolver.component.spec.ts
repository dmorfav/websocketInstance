import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWithResolverComponent } from './page-with-resolver.component';

describe('PageWithResolverComponent', () => {
  let component: PageWithResolverComponent;
  let fixture: ComponentFixture<PageWithResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWithResolverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWithResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
