import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weather-app';
}
