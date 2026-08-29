import { Component } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConfirmDialogComponentComponent } from './components/Delete confirm-dialog-component/confirm-dialog-component.component';
import { ConfirmationDialogComponent } from './components/Employee/confirmation-dialog/confirmation-dialog.component';
import { ToastContainerComponent } from './components/toast-container/toast-containe.component';
//import { NavbarComponent } from './components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ClarityModule,ToastContainerComponent,
    NavbarComponent,ConfirmationDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IT_Assert';


  }