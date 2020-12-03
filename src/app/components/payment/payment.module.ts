import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './payment.routes'
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AgGridModule} from "@ag-grid-community/angular";
import { PaymentHandlerComponent } from './payment-handler/payment-handler.component';
import { InvoiceComponent } from './invoice/invoice.component';



@NgModule({
  declarations: [
    PaymentHandlerComponent, InvoiceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
  ],
  exports:[
    
  ],
  entryComponents:[
    
  ]
})
export class PaymentModule { 
  public static routes = routes;
}
