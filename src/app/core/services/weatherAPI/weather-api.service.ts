import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../../interfaces/weatherResponse.interface';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {
  private apiUrl: string = "https://api.weatherbit.io/v2.0/forecast/hourly?";

  constructor(private http: HttpClient) { }


  getWeather(latitude: number, longitude: number): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.apiUrl}lat=${latitude}&lon=${longitude}&key=${environment.apiKeyWeather}&hours=48`);
  }
}
