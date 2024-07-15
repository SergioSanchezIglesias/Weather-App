import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { Datum, GeoDBCities } from '../../../core/interfaces/geoDBCities-Response.interface';
import { GeoDBCitiesService } from '../../../core/services/geoDBCities/geo-dbcities.service';
import * as dataJSON from '../../../../assets/json/response.json';
import { WeatherAPIService } from '../../../core/services/weatherAPI/weather-api.service';
import { WeatherResponse, DatumWeather } from '../../../core/interfaces/weatherResponse.interface';
import { Chart, registerables } from 'chart.js';

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

  private precipChart: Chart | undefined;
  precipitacionesData: number[] = [];
  precipitacionesLabels: string[] = [];

  dataTest = dataJSON;

  private latitude!: number;
  private longitude!: number;

  constructor(
    private geoDBCitiesService: GeoDBCitiesService,
    private weatherAPIService: WeatherAPIService,
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.citySearched = "Talavera de la Reina"
    
    this.filteredOptions = this.searchTerm.valueChanges.pipe(
      debounceTime(800),
      startWith(''),
      switchMap(value => this._filter(value || '')),
    );

    //? Carga datos por defecto para mostrar los graficos al entrar en la app.
    const hourlyData = this.dataTest.data;
    hourlyData.forEach(hour => {
      const date = new Date(hour.timestamp_local);
      if (date.getMinutes() === 0 && date.getHours() % 2 === 0) {
        this.precipitacionesData.push(hour.precip);
        this.precipitacionesLabels.push(`${date.getDate().toString()} - ${date.getHours().toString()}:00`);
      }
    });

    this._drawPrecipGraph();
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

  private _drawPrecipGraph() {
    const ctx = document.getElementById("precipChart") as HTMLCanvasElement;

    if (this.precipChart) {
      this.precipChart.destroy();
    }

    this.precipChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.precipitacionesLabels,
        datasets: [{
          label: 'Precipitación (mm)',
          data: this.precipitacionesData,
          borderColor: '#00c3ff',
          backgroundColor: 'rgba(0, 195, 255, 0.247)',
          fill: true
        }]
      },
      options: {
        responsive: true,
      }
    });
  }

  onOptionSelected(option: Datum): void {
    this.citySearched = option.city;
    this.latitude = option.latitude;
    this.longitude = option.longitude;

    this.precipitacionesData = [];
    this.precipitacionesLabels = [];

    this.weatherAPIService.getWeather(this.latitude, this.longitude).subscribe((data: WeatherResponse) => {
      const hourlyData = data.data;
      hourlyData.forEach((hour: DatumWeather) => {
        const date = new Date(hour.timestamp_local);

        if (date.getMinutes() === 0 && date.getHours() % 2 === 0) {
          this.precipitacionesData.push(hour.precip);
          this.precipitacionesLabels.push(`${date.getDate().toString()} - ${date.getHours().toString()}:00`);
        }
      });

      this._drawPrecipGraph();
    });
  }

  displayFn(option: Datum): string {
    return option ? `${option.city} - ${option.region}` : '';
  }
}
