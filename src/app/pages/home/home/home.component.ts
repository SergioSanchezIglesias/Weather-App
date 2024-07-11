import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import * as dataJSON from '../../../../assets/json/response.json';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchTerm = new FormControl('');
  dataTest = dataJSON;
  filteredOptions!: Observable<string[]>;

  constructor() { }

}
