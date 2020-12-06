import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/core/models/booking.model';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  
  existingBookingId: string;  
  existingBooking: Booking;

  constructor(private bookingDataService: BookingsDataService,private route: ActivatedRoute,private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.existingBookingId = params['id'];
    });

    this.existingBooking = this.bookingDataService.bookings.find(data => data.bookingId === this.existingBookingId);

    console.log(this.existingBooking.guestName);
  }

  print(){}

  close(){
    this.location.back();
  }
}
