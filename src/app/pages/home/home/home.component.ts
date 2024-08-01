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
  dataTest = dataJSON;

  searchTerm =           new FormControl('');
  filteredOptions!:      Observable<Datum[]>;
  citySearched!:         string;

  //? Variables para graficos
  private precipChart:   Chart | undefined;
  precipitacionesData:   number[] = [];
  precipitacionesLabels: string[] = [];

  private tempChart:     Chart | undefined;
  tempData:              number[] = [];
  tempLabels:            string[] = [];

  //? Varibales para las cards
  averageTemp!:          number;
  probPrecip!:           number;
  
  private latitude!:     number;
  private longitude!:    number;

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
        this.precipitacionesData.push(hour.pop);
        this.precipitacionesLabels.push(`${date.getDate().toString()} - ${date.getHours().toString()}:00`);

        this.tempData.push(hour.temp);
        this.tempLabels.push(`${date.getDate().toString()} - ${date.getHours().toString()}:00`)
      }
    });

    this.averageTemp = this._getAverageTemp();
    this.probPrecip = this._getProbPrecip();
    this._drawAllCharts();
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

  private _drawAllCharts() {
    this._drawPrecipChart();
    this._drawTempChart();
  }

  private _drawPrecipChart() {
    const ctx = document.getElementById("precipChart") as HTMLCanvasElement;

    if (this.precipChart) {
      this.precipChart.destroy();
    }

    this.precipChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.precipitacionesLabels,
        datasets: [{
          label: 'Precipitaciones (%)',
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

  private _drawTempChart() {
    const ctx = document.getElementById("tempChart") as HTMLCanvasElement;

    if (this.tempChart) {
      this.tempChart.destroy();
    }

    this.tempChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.tempLabels,
        datasets: [{
          label: 'Temperatura (ºC)',
          data: this.tempData,
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

  private _getAverageTemp(): number {
    if (this.dataTest.data.length === 0) {
      console.log("No hay datos para calcular la temperatura promedio.");
      return 0;  // Termina temprano si no hay datos
    }

    const totalTemp = this.dataTest.data.reduce((acc, curr) => acc + curr.temp, 0);
    const averageTemp = parseFloat((totalTemp / this.dataTest.data.length).toFixed(1));

    return averageTemp;
  }

  private _getProbPrecip(): number {
    if (this.dataTest.data.length === 0) {
      console.log("No hay datos para calcular la probabilidad de lluvia.");
      return 0;  // Termina temprano si no hay datos
    }

    const totalPrecip = this.dataTest.data.reduce((acc, curr) => acc + curr.pop, 0);
    const probPrecip = parseFloat((totalPrecip / this.dataTest.data.length).toFixed(1));

    return probPrecip;
  }

  onOptionSelected(option: Datum): void {
    this.citySearched = option.city;
    this.latitude = option.latitude;
    this.longitude = option.longitude;

    this.precipitacionesData = [];
    this.precipitacionesLabels = [];

    this.weatherAPIService.getWeather(this.latitude, this.longitude).subscribe((data: WeatherResponse) => {
      const hourlyData = data.data;

      //? Calculo de la temperatura media
      const totalTemp = hourlyData.reduce((acc, curr) => acc + curr.temp, 0);
      this.averageTemp = parseFloat((totalTemp / hourlyData.length).toFixed(1));

      //? Calculo de la probabilidad de lluevia
      const totalPrecip = hourlyData.reduce((acc, curr) => acc + curr.pop, 0);
      this.probPrecip = parseFloat((totalPrecip / hourlyData.length).toFixed(1));

      //? Calculo de las precipitaciones y temperatura cada 2 horas
      hourlyData.forEach((hour: DatumWeather) => {
        const date = new Date(hour.timestamp_local);

        if (date.getMinutes() === 0 && date.getHours() % 2 === 0) {
          this.precipitacionesData.push(hour.pop);
          this.precipitacionesLabels.push(`${date.getDate().toString()} - ${date.getHours().toString()}:00`);
        }
      });

      this._drawAllCharts();
    });
  }

  displayFn(option: Datum): string {
    return option ? `${option.city} - ${option.region}` : '';
  }
}
