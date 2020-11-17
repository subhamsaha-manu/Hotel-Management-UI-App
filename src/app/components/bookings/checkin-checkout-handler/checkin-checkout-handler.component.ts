import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Booking } from 'src/app/core/models/booking.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-checkin-checkout-handler',
  templateUrl: './checkin-checkout-handler.component.html',
  styleUrls: ['./checkin-checkout-handler.component.css']
})
export class CheckinCheckoutHandlerComponent{

  private toBeUpdatedBooking: Booking;


  bookingCheckInCheckOutForm = new FormGroup({
    bookingId: new FormControl({ disabled: true }),
    guestName: new FormControl({ disabled: true }),
    checkinDone: new FormControl({ value: '', disabled: true }),
    checkOutDone: new FormControl({ value: '', disabled: true })
  });
  checkOutStatus: boolean;
  checkInStatus: boolean;
  constructor(public dialogRef: MatDialogRef<CheckinCheckoutHandlerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingDataService: BookingsDataService) {

    this.toBeUpdatedBooking = this.bookingDataService.bookings.find(ele => ele.bookingId === data.bookingId)
    //console.log("Checkout handler ", this.toBeUpdatedBooking)
    //console.log("Checkout value init ",this.bookingCheckInCheckOutForm.get('checkOutDone').value)
    this.bookingCheckInCheckOutForm.patchValue({
      bookingId: this.toBeUpdatedBooking.bookingId,
      guestName: this.toBeUpdatedBooking.guestName,
      checkinDone: this.toBeUpdatedBooking.checkinDone+"",
      checkOutDone: this.toBeUpdatedBooking.checkoutDone+""
    });

    this.checkInStatus = this.toBeUpdatedBooking.checkinDone;
    this.checkOutStatus = this.toBeUpdatedBooking.checkoutDone;
    if (this.toBeUpdatedBooking.checkinDone===true) {
      this.bookingCheckInCheckOutForm.get('checkOutDone').enable()
    } else {
      this.bookingCheckInCheckOutForm.get('checkinDone').enable()
    }
    if (this.toBeUpdatedBooking.checkoutDone) {
      this.bookingCheckInCheckOutForm.get('checkinDone').disable()
      this.bookingCheckInCheckOutForm.get('checkOutDone').disable()
    }
  }

  onSubmit() {
    if (this.bookingCheckInCheckOutForm.get('checkOutDone').value==="true" && !this.toBeUpdatedBooking.fullPaymentDone===true) {
      Swal.fire('Warning', 'Cannot checkout guest as payment pending', 'warning').then(()=>this.dialogRef.close())      
    } else {
      this.toBeUpdatedBooking.checkinDone = this.bookingCheckInCheckOutForm.get('checkinDone').value
      this.toBeUpdatedBooking.checkoutDone = this.bookingCheckInCheckOutForm.get('checkOutDone').value
      this.bookingDataService.updateData(this.toBeUpdatedBooking).subscribe(data => {
        Swal.fire('Success!!', 'Booking record ' + data + ' modified successfully', 'success').then(()=>{
          this.bookingDataService.fetchData();
          this.dialogRef.close();
        })        
      })
    }
  }
}
