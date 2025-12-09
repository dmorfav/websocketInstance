import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component2.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'websocketInstance';
}
