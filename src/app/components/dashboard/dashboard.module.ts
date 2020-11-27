import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './dashboard.routes';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from '../shared/shared.module';

import { AgChartsAngularModule } from 'ag-charts-angular';


@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgChartsAngularModule
  ]
})
export class DashboardModule { 
  public static routes = routes;
}
