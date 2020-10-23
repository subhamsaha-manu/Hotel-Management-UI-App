import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bookings-form',
  templateUrl: './bookings-form.component.html',
  styleUrls: ['./bookings-form.component.css']
})
export class BookingsFormComponent implements OnInit {

  reservationForm: FormGroup
  constructor() { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      lastName: new FormControl(''),
      address: new FormGroup({
        firstLine: new FormControl(''),
        secondLine: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zip: new FormControl('')
      }),
      phone: new FormControl(''),
      email: new FormControl(''),
      bookingDetails: new FormGroup({
        checkin: new FormControl(''),
        checkout: new FormControl('')
      }),
      guestDetails: new FormGroup({
        adults: new FormControl(''),
        child: new FormControl('')
      }),
      room: new FormControl('')
    });
  }

  onSubmit() {
    console.log(this.reservationForm);
    console.log(this.reservationForm);
  }

}
