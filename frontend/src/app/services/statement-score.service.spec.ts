import { TestBed } from '@angular/core/testing';

import { StatementScoreService } from './statement-score.service';

describe('StatementScoreService', () => {
  let service: StatementScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatementScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
