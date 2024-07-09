import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoDBCities } from '../../interfaces/geoDBCities-Response.interface';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class GeoDBCitiesService {
  private apiUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
  private headers = new HttpHeaders({
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
    'x-rapidapi-key': environment.apiKeyCities
  });

  constructor(private http: HttpClient) { }

  searchCities(searchTerm: string): Observable<GeoDBCities> {
    const url: string = `${this.apiUrl}/cities/namePrefix=${searchTerm}`;
    return this.http.get<GeoDBCities>(url, { headers: this.headers });
  }
}
