import { Component } from '@angular/core';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink,
    RouterLinkActive,ClarityModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 user: any;
  showDropdown = false;

  constructor(
   
    private router: Router
  ) {}

 
  
goHome() {
  this.router.navigate(['/Homepage']);
}


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {

    // // 🔥 Clear everything
    localStorage.clear();
    sessionStorage.clear();

    // //this.authService.logout();

    // // 🔥 Redirect to login
    this.router.navigate(['/']);
  }


}
