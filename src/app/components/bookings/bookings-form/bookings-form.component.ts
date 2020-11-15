import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { RefDataService } from 'src/app/core/services/ref-data.service';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/core/models/booking.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bookings-form',
  templateUrl: './bookings-form.component.html',
  styleUrls: ['./bookings-form.component.css']
})
export class BookingsFormComponent implements OnInit {

  @ViewChild('checkOutDP') checkOutDP;
  submitted: boolean = false;
  reservationForm: FormGroup;
  roomTypes: {};
  roomSizes: {};
  roomNumbers: {};
  existingBookingId: string;
  existingBooking: Booking;
  checkOutStatus: boolean;

  private _checkinDate: Date;
  private _checkinTime: string;
  private _checkoutDate: Date;
  private _checkoutTime: string;
  private _roomType: string;
  private _roomSize: string;
  
  constructor(private dataService: RefDataService, private bookingDataService: BookingsDataService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.existingBookingId = params['id'];
    });

    //console.log("Id in form ",this.id)


    this.reservationForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl(''),
      guestName: new FormControl(''),
      firstLine: new FormControl(''),
      secondLine: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      idType: new FormControl(''),
      idNumber: new FormControl(''),
      adults: new FormControl(''),
      child: new FormControl(''),
      fullPaymentDone: new FormControl(''),
      paymentAmount: new FormControl(''),
      checkinDate: new FormControl({ value: '', disabled: true }),
      checkinTime: new FormControl({ value: '', disabled: true }),
      checkoutDate: new FormControl({ value: '', disabled: true }, this.dateLessThan('checkinDate', 'checkoutDate')),
      checkoutTime: new FormControl({ value: '', disabled: true }),
      roomType: new FormControl({ value: '', disabled: true }),
      roomSize: new FormControl({ value: '', disabled: true }),
      roomNumber: new FormControl({ value: '', disabled: true }),
      bookingStatus: new FormControl({ value: '', disabled: true }),
      checkinDone: new FormControl({ value: "false", disabled: true }),
      checkoutDone: new FormControl("false"),
      bookingId: new FormControl('')
    });
    if (this.existingBookingId) {
      this.existingBooking = this.bookingDataService.bookings.find(data => data.bookingId === this.existingBookingId)
      this.checkOutStatus = this.existingBooking.checkoutDone
      console.log("Existing Booking ", this.existingBooking)
      this.dataService.roomTypes(new Date(this.existingBooking.checkinDate),
        this.existingBooking.checkinTime,
        new Date(this.existingBooking.checkoutDate),
        this.existingBooking.checkoutTime,
        this.existingBooking.bookingId).subscribe(
          data => {
            this.roomTypes = data
          })
      this.dataService.roomSizes(new Date(this.existingBooking.checkinDate),
        this.existingBooking.checkinTime,
        new Date(this.existingBooking.checkoutDate),
        this.existingBooking.checkoutTime,
        this.existingBooking.roomType,
        this.existingBooking.bookingId).subscribe(
          data => {
            this.roomSizes = data
          })
      this.dataService.roomNumbers(new Date(this.existingBooking.checkinDate),
        this.existingBooking.checkinTime,
        new Date(this.existingBooking.checkoutDate),
        this.existingBooking.checkoutTime,
        this.existingBooking.roomType,
        this.existingBooking.roomSize,
        this.existingBooking.bookingId).subscribe(
          data => {
            this.roomNumbers = data
          })
      this.reservationForm.setValue(this.existingBooking)
      this.reservationForm.patchValue({
        checkinDone: this.existingBooking.checkinDone + "",
        fullPaymentDone: this.existingBooking.fullPaymentDone + ""
      })
      this.reservationForm.get('roomType').enable()
      this.reservationForm.get('checkinDone').enable()
      if(this.checkOutStatus){
       this.reservationForm.disable(); 
      }
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.reservationForm.controls[controlName].hasError(errorName);
  }

  dateLessThan(from: string, to: string) {
    console.log('Here')
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      console.log("chk " + f + " " + t)
      if (f.value < t.value) {
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }

  addCheckinDate(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log(`${type}: ${event.value}`)
    //console.log(this.reservationForm.get('bookingDetails.checkin').value.getHours())
    //console.log(this.checkOutDP)
    this.reservationForm.get('checkinTime').enable()
  }

  onSetCheckInTime(event: EventEmitter<string>) {
    this.checkOutDP.disabled = false
    console.log("Checkin Date set ", event)
  }

  addCheckoutDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.reservationForm.get('checkoutTime').enable()
  }

  onSetCheckOutTime(event: EventEmitter<string>) {
    this._checkinDate = this.reservationForm.get('checkinDate').value
    this._checkinTime = this.reservationForm.get('checkinTime').value
    this._checkoutDate = this.reservationForm.get('checkoutDate').value
    this._checkoutTime = event + ""
    this.dataService.roomTypes(this._checkinDate, this._checkinTime, this._checkoutDate, this._checkoutTime).subscribe(
      data => {
        this.roomTypes = data
        this.reservationForm.get('roomType').enable()
      })
  }

  onChangeRoomType(roomType: string) {
    this._roomType = roomType

    if (!this.existingBookingId) {
      this.dataService.roomSizes(this._checkinDate, this._checkinTime, this._checkoutDate, this._checkoutTime, roomType).subscribe(
        data => {
          this.roomSizes = data
          this.reservationForm.get('roomSize').enable()
        }
      )
    } else {
      this.dataService.roomSizes(new Date(this.existingBooking.checkinDate),
        this.existingBooking.checkinTime,
        new Date(this.existingBooking.checkoutDate),
        this.existingBooking.checkoutTime,
        this._roomType,
        this.existingBooking.bookingId).subscribe(
          data => {
            this.roomSizes = data
            this.reservationForm.get('roomSize').enable()
          })
    }
  }

  onChangeRoomSize(roomSize: string) {

    this._roomSize = roomSize
    if (!this.existingBookingId) {
      this.dataService.roomNumbers(this._checkinDate, this._checkinTime, this._checkoutDate, this._checkoutTime, this._roomType, roomSize).subscribe(
        data => {
          this.roomNumbers = data
          this.reservationForm.get('roomNumber').enable()
        }
      )
    } else {
      this.dataService.roomNumbers(new Date(this.existingBooking.checkinDate),
        this.existingBooking.checkinTime,
        new Date(this.existingBooking.checkoutDate),
        this.existingBooking.checkoutTime,
        this._roomType,
        this._roomSize,
        this.existingBooking.bookingId).subscribe(
          data => {
            this.roomNumbers = data
            this.reservationForm.get('roomNumber').enable()
          })
    }

  }

  onChangeRoomNumber(roomNumber: string) {
    this.reservationForm.get('checkinDone').enable()
  }

  onSubmit() {
    //console.log(this.reservationForm.value);
    this.submitted = true;
    if (this.existingBookingId && this.reservationForm.valid) {
      this.bookingDataService.updateData(this.reservationForm.getRawValue()).subscribe(data => {
        Swal.fire('Booking with :- ' + data, 'Updated succesfully!!', 'success').then(() => {
          this.location.back();
        });
      });
    } else if (this.reservationForm.valid) {
      this.bookingDataService.saveData(this.reservationForm.getRawValue()).subscribe(data => {
        this.location.back();
      });
    }
  }

  onReset() {
    this.reservationForm.reset();
  }

  onClose(){
    this.location.back();
  }
}
