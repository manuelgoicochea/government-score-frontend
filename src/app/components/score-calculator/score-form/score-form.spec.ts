import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreForm } from './score-form';

describe('ScoreForm', () => {
  let component: ScoreForm;
  let fixture: ComponentFixture<ScoreForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
