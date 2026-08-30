import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';   // ✅ for routing
import { routes } from './app/app.routes';         // ✅ import your routes array

//Optional: Clarity imports if you use Clarity Design System
//import '@cds/core/styles';
import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
import { ClarityIcons, cogIcon,shieldCheckIcon, pencilIcon, trashIcon ,popOutIcon,arrowIcon, linkIcon, usersIcon, boxPlotIcon, storeIcon, shoppingCartIcon, dashboardIcon, refreshIcon, userIcon, devicesIcon, historyIcon, plusIcon, pasteIcon, timesCircleIcon, assignUserIcon, searchIcon, timelineIcon, checkIcon, uploadIcon, downloadIcon, angleIcon, infoCircleIcon, floppyIcon, shoppingBagIcon, fileIcon, uploadCloudIcon, errorStandardIcon, printerIcon, infoStandardIcon, wrenchIcon, exclamationCircleIcon, exclamationTriangleIcon} from '@cds/core/icon';

ClarityIcons.addIcons(cogIcon,pencilIcon,arrowIcon,
  trashIcon, shieldCheckIcon,linkIcon,usersIcon,storeIcon,shoppingCartIcon,boxPlotIcon,popOutIcon,
  refreshIcon,userIcon,devicesIcon,historyIcon,
  arrowIcon,trashIcon,plusIcon,pasteIcon,timesCircleIcon,assignUserIcon,searchIcon,timelineIcon,checkIcon,uploadIcon,downloadIcon,storeIcon,angleIcon,infoCircleIcon,floppyIcon,shoppingBagIcon,fileIcon,uploadCloudIcon,errorStandardIcon,printerIcon,infoStandardIcon,wrenchIcon,searchIcon,exclamationCircleIcon,exclamationTriangleIcon,
  dashboardIcon);

import { provideAnimations } from '@angular/platform-browser/animations'; 
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes) ,
      provideAnimations(),   
      // ✅ register routes here
  ]
}).catch(err => console.error(err));
