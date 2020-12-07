import { Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { RefDataService } from 'src/app/core/services/ref-data.service';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/core/models/booking.model';
import Swal from 'sweetalert2';


export interface Room{
  roomType : string,
  roomSize : string,
  roomNumber : string
}

@Component({
  selector: 'app-bookings-form',
  templateUrl: './new.html',
  styleUrls: ['./new.css']
})
export class BookingsFormComponent implements OnInit {

  @ViewChild('checkOutDP') checkOutDP;
  submitted: boolean = false;
  reservationForm: FormGroup;
  roomTypes: any;
  roomSizes: any;
  roomNumbers: any;
  existingBookingId: string;
  existingBooking: Booking;
  checkOutStatus: boolean;
  selectedRooms:Array<Room> = [];

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
      guestName: new FormControl('', Validators.required),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country:new FormControl(''),
      zip: new FormControl(''),
      foreignNational:new FormControl(),
      phone: new FormControl(''),
      email: new FormControl(''),
      idType: new FormControl(''),
      idNumber: new FormControl(''),
      guests: new FormControl(1),
      fullPaymentDone: new FormControl(''),
      paymentAmount: new FormControl(''),
      totalPayableAmount:new FormControl({value:'',disabled:true}),
      checkinDate: new FormControl(),
      checkoutDate: new FormControl(),
      checkinTime: new FormControl({ value: '09:00', disabled: true }),
      checkoutTime: new FormControl({ value: '10:00', disabled: true }),
      roomType: new FormControl({ value: '', disabled: true }),
      roomSize: new FormControl({ value: '', disabled: true }),
      roomNumber: new FormControl({ value: '', disabled: true }),
      bookingStatus: new FormControl({ value: '', disabled: true }),
      checkinDone: new FormControl({ value: "false", disabled: true }),
      checkoutDone: new FormControl("false"),
      groupReservation:new FormControl(),
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

  addCheckoutDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.reservationForm.get('checkinTime').enable()
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
      this.bookingDataService.saveData(this.reservationForm.getRawValue()).subscribe(data => {Swal.fire('Booking with :- ' + data, 'added succesfully!!', 'success').then(() => {
        this.location.back();
      });
      });
    }
  }

  increment(){
    //console.log(this.reservationForm.get('guests').value);
    let guests = this.reservationForm.get('guests').value;
    //console.log(guests++);
    this.reservationForm.patchValue({guests:++guests})
    console.log("Grp ",this.reservationForm.get('groupReservation').value);
  }

  decrement(){
    let guests = this.reservationForm.get('guests').value;
    //console.log(guests++);
    this.reservationForm.patchValue({guests:--guests})
  }

  addRoom(){
    var selectedRoom = {
      roomType:this.reservationForm.get('roomType').value,    
      roomSize:this.reservationForm.get('roomSize').value,
      roomNumber:this.reservationForm.get('roomNumber').value
    };
    this.selectedRooms.push(selectedRoom)
    this.roomNumbers.splice(this.roomNumbers.indexOf(this.reservationForm.get('roomNumber').value),1)
    this.reservationForm.patchValue({
      guests : 1,
      roomType :'',
      roomSize :'',
      roomNumber : ''
    });
    this.reservationForm.get('roomType').disable();
    this.reservationForm.get('roomSize').disable();
    this.reservationForm.get('roomNumber').disable();
    this.dataService.roomTypes(this._checkinDate, this._checkinTime, this._checkoutDate, this._checkoutTime).subscribe(
      data => {
        this.roomTypes = data
        this.reservationForm.get('roomType').enable()
      });
  }

  deleteRow(index){
    console.log(this.selectedRooms[index])
    this.selectedRooms.splice(index,1);
    this.roomTypes.push(this.selectedRooms[index].roomType);
    this.roomSizes.push(this.selectedRooms[index].roomSize);
    this.roomNumbers.push(this.selectedRooms[index].roomNumber);
  }

  onReset() {
    this.reservationForm.reset();
  }

  onClose(){
    this.location.back();
  }
}
