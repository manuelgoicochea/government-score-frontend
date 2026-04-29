import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesDashboard } from './countries-dashboard';

describe('CountriesDashboard', () => {
  let component: CountriesDashboard;
  let fixture: ComponentFixture<CountriesDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(CountriesDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
