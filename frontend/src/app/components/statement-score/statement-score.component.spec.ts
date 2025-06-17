import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementScoreComponent } from './statement-score.component';

describe('StatementScoreComponent', () => {
  let component: StatementScoreComponent;
  let fixture: ComponentFixture<StatementScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
