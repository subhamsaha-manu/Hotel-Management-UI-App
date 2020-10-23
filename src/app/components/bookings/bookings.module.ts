import { NgModule } from '@angular/core';
import { BookingsFormComponent } from './bookings-form/bookings-form.component';
import { RouterModule } from '@angular/router';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { BookingsDetailComponent } from './bookings-detail/bookings-detail.component';
import { routes } from './bookings.routes';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [ BookingsFormComponent, BookingsListComponent, BookingsDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  exports:[
  ]
})
export class BookingsModule { 
  public static routes = routes;
}
