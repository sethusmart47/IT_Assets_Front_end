import { Component } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ClarityModule,AddEmployeeComponent,ViewEmployeeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IT_Assert';
constructor(private router:Router){}

  add() {
    this.router.navigate(['add']);
  }

  view() {
    this.router.navigate(['/view1']); // matches lowercase route
  }}