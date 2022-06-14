import { TestBed } from '@angular/core/testing';

import { SignalrcustomService } from './signalrcustom.service';

describe('SignalrcustomService', () => {
  let service: SignalrcustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrcustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
