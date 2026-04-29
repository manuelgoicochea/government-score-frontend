import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightSliders } from './weight-sliders';

describe('WeightSliders', () => {
  let component: WeightSliders;
  let fixture: ComponentFixture<WeightSliders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightSliders],
    }).compileComponents();

    fixture = TestBed.createComponent(WeightSliders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
