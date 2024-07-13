import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { Datum, GeoDBCities } from '../../../core/interfaces/geoDBCities-Response.interface';
import { GeoDBCitiesService } from '../../../core/services/geoDBCities/geo-dbcities.service';
import * as dataJSON from '../../../../assets/json/response.json';
import { WeatherAPIService } from '../../../core/services/weatherAPI/weather-api.service';
import { WeatherResponse } from '../../../core/interfaces/weatherResponse.interface';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchTerm = new FormControl('');
  filteredOptions!: Observable<Datum[]>;
  citySearched!: string;

  temperature!: number;
  humidity!: number;
  windSpeed!: number;
  windDirection!: number;

  dataTest = dataJSON;

  private latitude!: number;
  private longitude!: number;

  constructor(
    private geoDBCitiesService: GeoDBCitiesService,
    private weatherAPIService: WeatherAPIService,
  ) { }

  ngOnInit(): void {
    this.filteredOptions = this.searchTerm.valueChanges.pipe(
      debounceTime(800),
      startWith(''),
      switchMap(value => this._filter(value || '')),
    );
  }

  private _filter(value: string | Datum): Observable<Datum[]> {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'object' && value !== null) {
      filterValue = value.city.toLowerCase();
    }

    return this.geoDBCitiesService.searchCities(filterValue).pipe(
      map((data: GeoDBCities) => data.data.filter(option => option.city.toLowerCase().includes(filterValue))),
      catchError(() => of([]))
    );
  }

  onOptionSelected(option: Datum): void {
    this.citySearched = option.city;
    this.latitude = option.latitude;
    this.longitude = option.longitude;

    // this.weatherAPIService.getWeather(this.latitude, this.longitude).subscribe((data: WeatherResponse) => {});
    this.temperature = this._convertKelvinToCelsius(dataJSON.main.temp);
    this.humidity = dataJSON.main.humidity;
    this.windSpeed = dataJSON.wind.speed;
    this.windDirection = dataJSON.wind.deg
  }

  displayFn(option: Datum): string {
    return option ? `${option.city} - ${option.region}` : '';
  }

  private _convertKelvinToCelsius(kelvin: number) {
    return kelvin - 273.15;
  }

}
