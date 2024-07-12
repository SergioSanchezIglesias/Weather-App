import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { Datum, GeoDBCities } from '../../../core/interfaces/geoDBCities-Response.interface';
import { GeoDBCitiesService } from '../../../core/services/geoDBCities/geo-dbcities.service';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(private geoDBCitiesService: GeoDBCitiesService) { }

  ngOnInit(): void {
    this.filteredOptions = this.searchTerm.valueChanges.pipe(
      debounceTime(800),
      startWith(''),
      switchMap(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): Observable<Datum[]> {
    const filterValue = value.toLowerCase();

    return this.geoDBCitiesService.searchCities(filterValue).pipe(
      map((data: GeoDBCities) => data.data.filter(option => option.city.toLowerCase().includes(filterValue))),
      catchError(() => of([]))
    )

  }

  onOptionSelected(selectedCity: string): void {
    this.citySearched = selectedCity;
  }

}
