import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';   // ✅ for routing
import { routes } from './app/app.routes';         // ✅ import your routes array

// Optional: Clarity imports if you use Clarity Design System
// import '@cds/core/styles';
// import '@cds/core/button/register.js';
// import '@cds/core/icon/register.js';
// import { ClarityIcons } from '@cds/core/icon';
// import { cogIcon } from '@cds/core/icon/shapes/cog.js';
// ClarityIcons.addIcons(cogIcon);


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)   // ✅ register routes here
  ]
}).catch(err => console.error(err));
