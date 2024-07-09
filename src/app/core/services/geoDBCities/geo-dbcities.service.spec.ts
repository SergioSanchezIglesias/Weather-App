import { TestBed } from '@angular/core/testing';

import { GeoDBCitiesService } from './geo-dbcities.service';

describe('GeoDBCitiesService', () => {
  let service: GeoDBCitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoDBCitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
