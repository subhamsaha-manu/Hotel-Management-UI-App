import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Booking } from 'src/app/core/models/booking.model';

@Component({
  selector: 'app-checkin-checkout-handler',
  templateUrl: './checkin-checkout-handler.component.html',
  styleUrls: ['./checkin-checkout-handler.component.css']
})
export class CheckinCheckoutHandlerComponent implements OnInit {

  bookingCheckInCheckOutForm = new FormGroup({
    bookingId:new FormControl(),
    guestName:new FormControl(),
    checkinDone: new FormControl(''),
    checkOutDone: new FormControl('')
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private bookingDataService: BookingsDataService) {
    
    var toBeUpdatedBooking:Booking; 
    toBeUpdatedBooking = this.bookingDataService.bookings.find(ele => ele.bookingId === data.bookingId)
    console.log("Checkout handler ",toBeUpdatedBooking)
    this.bookingCheckInCheckOutForm.patchValue({
      bookingId: toBeUpdatedBooking.bookingId,
      guestName: toBeUpdatedBooking.guestName,
      checkinDone: toBeUpdatedBooking.checkinDone+"",
      checkOutDone: toBeUpdatedBooking.checkoutDone+""
    });
  }

  ngOnInit(): void {
  }

  onSubmit(){}

}
