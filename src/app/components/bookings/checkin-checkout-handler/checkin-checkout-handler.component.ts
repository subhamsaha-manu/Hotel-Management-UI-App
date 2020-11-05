import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Booking } from 'src/app/core/models/booking.model';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkin-checkout-handler',
  templateUrl: './checkin-checkout-handler.component.html',
  styleUrls: ['./checkin-checkout-handler.component.css']
})
export class CheckinCheckoutHandlerComponent implements OnInit {

  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';
  private toBeUpdatedBooking: Booking;


  bookingCheckInCheckOutForm = new FormGroup({
    bookingId: new FormControl({ disabled: true }),
    guestName: new FormControl({ disabled: true }),
    checkinDone: new FormControl({ value: '', disabled: true }),
    checkOutDone: new FormControl({ value: '', disabled: true })
  });
  constructor(private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CheckinCheckoutHandlerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingDataService: BookingsDataService) {

    this.toBeUpdatedBooking = this.bookingDataService.bookings.find(ele => ele.bookingId === data.bookingId)
    console.log("Checkout handler ", this.toBeUpdatedBooking)
    this.bookingCheckInCheckOutForm.patchValue({
      bookingId: this.toBeUpdatedBooking.bookingId,
      guestName: this.toBeUpdatedBooking.guestName,
      checkinDone: this.toBeUpdatedBooking.checkinDone + "",
      checkOutDone: this.toBeUpdatedBooking.checkoutDone + ""
    });

    if (this.toBeUpdatedBooking.checkinDone) {
      this.bookingCheckInCheckOutForm.get('checkOutDone').enable()
    } else {
      this.bookingCheckInCheckOutForm.get('checkinDone').enable()
    }
    if (this.toBeUpdatedBooking.checkoutDone) {
      this.bookingCheckInCheckOutForm.get('checkOutDone').disable()
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.toBeUpdatedBooking.checkinDone = this.bookingCheckInCheckOutForm.get('checkinDone').value
    if(this.bookingCheckInCheckOutForm.get('checkOutDone').value && !this.toBeUpdatedBooking.fullPaymentDone){
      this._snackBar.open('Cannot checkout guest as payment pending', ':(', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.dialogRef.close();
    }else{
      this.toBeUpdatedBooking.checkoutDone = this.bookingCheckInCheckOutForm.get('checkOutDone').value
      this.bookingDataService.updateData(this.toBeUpdatedBooking).subscribe(data => {
        this._snackBar.open('Booking record '+data+' modified successfully', ':)', {
          duration: 1000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.dialogRef.close();
      })
    }    
  }
}
