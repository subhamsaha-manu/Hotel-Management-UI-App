import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { RefDataService } from 'src/app/core/services/ref-data.service';

let emailRegex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

@Component({
  selector: 'app-bookings-form',
  templateUrl: './bookings-form.component.html',
  styleUrls: ['./bookings-form.component.css']
})
export class BookingsFormComponent implements OnInit {

  @ViewChild('checkOutDP') checkOutDP;
  reservationForm: FormGroup;
  roomTypes:{};
  roomSizes:{};
  roomNumbers:{};
  private _dateFrom:string;
  private _dateTo:string;
  private _roomType: string;
  constructor(private dataService: RefDataService,private bookingDataService: BookingsDataService) { }

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
      contactInfo: new FormGroup({
        phone: new FormControl(''),
        email: new FormControl(''),
        idType: new FormControl(''),
        idNumber: new FormControl('')
      }),      
      guestDetails: new FormGroup({
        adults: new FormControl(''),
        child: new FormControl(''),
        paymentStatus: new FormControl(''),
        paymentAmount:new FormControl('')
      }),
      bookingDetails: new FormGroup({
        checkin: new FormControl({ value: '', disabled: true }),
        checkout: new FormControl({ value: '', disabled: true }),
        roomType: new FormControl({ value: '', disabled: true }),
        roomSize: new FormControl({ value: '', disabled: true }),
        roomNumber: new FormControl({ value: '', disabled: true }),
        bookingStatus: new FormControl({ value: '', disabled: true })
      })
    });
  }

  addCheckinDate(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log(`${type}: ${event.value}`)
    //console.log(this.reservationForm.get('bookingDetails.checkin').value.getHours())
    //console.log(this.checkOutDP)
    this.checkOutDP.disabled = false
  }

  addCheckoutDate(type: string, event: MatDatepickerInputEvent<Date>) {
    
    this.reservationForm.get('bookingDetails')['controls']['roomType'].enable()
    this._dateFrom = this.reservationForm.get('bookingDetails.checkin').value
    this._dateTo = this.reservationForm.get('bookingDetails.checkout').value
    this.dataService.roomTypes(this._dateFrom, this._dateTo).subscribe(
      data => {
        this.roomTypes = data
      }
    )
  }

  onChangeRoomType(roomType:string){
    this._roomType = roomType
    this.reservationForm.get('bookingDetails')['controls']['roomSize'].enable()
    this.dataService.roomSizes(this._dateFrom, this._dateTo,roomType).subscribe(
      data => {
        this.roomSizes = data
      }
    )
  }

  onChangeRoomSize(roomSize:string){
    this.reservationForm.get('bookingDetails')['controls']['roomNumber'].enable()
    this.dataService.roomNumbers(this._dateFrom, this._dateTo,this._roomType,roomSize).subscribe(
      data => {
        this.roomNumbers = data
      }
    )
  }

  onChangeRoomNumber(roomNumber:string){
    this.reservationForm.get('bookingDetails')['controls']['bookingStatus'].enable()
  }

  onSubmit() {
    //console.log(this.reservationForm.value);
    this.bookingDataService.saveData(this.reservationForm.getRawValue())
  }

  onReset(){
    this.reservationForm.reset();
  }
}
