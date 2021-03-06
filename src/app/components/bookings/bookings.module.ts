import { NgModule } from '@angular/core';
import { BookingsFormComponent } from './bookings-form/bookings-form.component';
import { RouterModule } from '@angular/router';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { BookingsDetailComponent } from './bookings-detail/bookings-detail.component';
import { routes } from './bookings.routes';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AgGridModule} from "@ag-grid-community/angular";
import { UpdateButtonComponent } from '../update-button/update-button.component';
import { CheckinCheckoutHandlerComponent } from './checkin-checkout-handler/checkin-checkout-handler.component';



@NgModule({
  declarations: [ 
    BookingsFormComponent, 
    BookingsListComponent, 
    BookingsDetailComponent,
    UpdateButtonComponent, 
    CheckinCheckoutHandlerComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([UpdateButtonComponent]),
    NgxMaterialTimepickerModule
  ],
  exports:[
    CheckinCheckoutHandlerComponent
  ],
  entryComponents:[
    CheckinCheckoutHandlerComponent
  ]
})
export class BookingsModule { 
  public static routes = routes;
}
