import { TestBed } from '@angular/core/testing';

import { MindService } from './mind.service';

describe('MindService', () => {
  let service: MindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
