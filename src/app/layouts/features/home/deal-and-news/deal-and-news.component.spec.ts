import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealAndNewsComponent } from './deal-and-news.component';

describe('DealAndNewsComponent', () => {
  let component: DealAndNewsComponent;
  let fixture: ComponentFixture<DealAndNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealAndNewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DealAndNewsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
