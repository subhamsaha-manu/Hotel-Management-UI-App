import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NoContentComponent } from './components/no-content/no-content.component';

const routes: Routes = [{
  path: '',
  component: LoginComponent
}, {
  path: 'dashboard',
  loadChildren: () => import('./components/dashboard').then(m => m.DashboardModule)
  
}, {
  path: 'bookings',
  loadChildren: () => import('./components/bookings').then(m => m.BookingsModule)
  
}, {
  path: 'rooms',
  loadChildren: () => import('./components/rooms').then(m => m.RoomsModule)
  
}, {
  path: '**',
  component: NoContentComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy:PreloadAllModules
    }
   )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
