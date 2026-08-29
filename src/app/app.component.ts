import { Component } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
//import { NavbarComponent } from './components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ClarityModule,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IT_Assert';


  }