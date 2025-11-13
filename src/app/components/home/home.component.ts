import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private router:Router){}
  add() {
    this.router.navigate(['add']);
  }

  view() {
    this.router.navigate(['/view1']); // matches lowercase route
  }
}
