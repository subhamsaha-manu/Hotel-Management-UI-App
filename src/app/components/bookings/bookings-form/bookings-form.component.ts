import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { RefDataService } from 'src/app/core/services/ref-data.service';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/core/models/booking.model';
import Swal from 'sweetalert2';
import { Room } from 'src/app/core/models/room.model';
import { RoomFinder } from 'src/app/core/models/roomFinder.model';
import { PaymentDetail } from 'src/app/core/models/paymentDetails.model';

@Component({
  selector: 'app-bookings-form',
  templateUrl: './bookings-form.component.html',
  styleUrls: ['./bookings-form.component.css'],
})
export class BookingsFormComponent implements OnInit {
  @ViewChild('checkOutDP') checkOutDP;
  submitted: boolean = false;
  reservationForm: FormGroup;
  roomTypes: any;
  roomSizes: any;
  roomNumbers: any;
  roomPrice: any;
  existingBookingId: string;
  existingBooking: Booking;
  checkOutStatus: boolean;
  selectedRooms: Array<Room> = [];
  paymentDetails: Array<PaymentDetail> = [];
  condition: boolean = true;
  showHide: boolean = false;

  private _checkinDate: Date;
  private _checkinTime: string;
  private _checkoutDate: Date;
  private _checkoutTime: string;
  private _roomType: string;
  private _roomSize: string;
  private _roomFinder: RoomFinder;
  private _checkinDateStr: string;
  private _checkoutDateStr: string;
  private _totalPayableAmount: number = 0;
  private _diffInDays: number;
  private _updateRoomFinder: RoomFinder;

  constructor(
    private dataService: RefDataService,
    private bookingDataService: BookingsDataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.existingBookingId = params['id'];
    });

    //console.log("Id in form ",this.id)

    this.reservationForm = new FormGroup({
      guestName: new FormControl('', Validators.required),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      zip: new FormControl(''),
      internationalGuests: new FormControl(),
      phone: new FormControl(''),
      email: new FormControl(''),
      idType: new FormControl(''),
      idNumber: new FormControl(''),
      totalNoOfGuests: new FormControl(1),
      paidAmount: new FormControl(+''),
      paymentMode: new FormControl(''),
      amountDue: new FormControl({
        value: this._totalPayableAmount,
        disabled: true,
      }),
      totalPayableAmount: new FormControl({
        value: this._totalPayableAmount,
        disabled: false,
      }),
      checkinDate: new FormControl(),
      checkoutDate: new FormControl(),
      checkinTime: new FormControl({ value: '09:00', disabled: true }),
      checkoutTime: new FormControl({ value: '', disabled: true }),
      roomType: new FormControl({ value: '', disabled: true }),
      roomSize: new FormControl({ value: '', disabled: true }),
      roomNumber: new FormControl({ value: '', disabled: true }),
      roomPrice: new FormControl({ value: +'', disabled: false }),
      bookingStatus: new FormControl({ value: '', disabled: true }),
      checkinDone: new FormControl({ value: 'false', disabled: true }),
      checkoutDone: new FormControl('false'),
      groupReservation: new FormControl(),
      bookingId: new FormControl(''),
    });
    if (this.existingBookingId) {
      this.showHide = true;
      this.existingBooking = this.bookingDataService.bookings.find(
        (data) => data.bookingId === this.existingBookingId
      );
      this.checkOutStatus = this.existingBooking.checkoutDone;
      console.log('Existing Booking ', this.existingBooking);
      this.reservationForm.patchValue({
        guestName: this.existingBooking.guestName,
        address: this.existingBooking.address,
        city: this.existingBooking.city,
        state: this.existingBooking.state,
        country: this.existingBooking.country,
        zip: this.existingBooking.zip,
        internationalGuests: this.existingBooking.internationalGuests,
        phone: this.existingBooking.phone,
        email: this.existingBooking.email,
        idType: this.existingBooking.idType,
        idNumber: this.existingBooking.idNumber,
        totalNoOfGuests: 1,
        paidAmount: 0,
        paymentMode: '',
        amountDue:
          this.existingBooking.totalPayableAmount -
          this.existingBooking.paidAmount,
        totalPayableAmount: this.existingBooking.totalPayableAmount,
        checkinDate: this.existingBooking.checkinDate,
        checkoutDate: this.existingBooking.checkoutDate,
        checkinTime: this.existingBooking.checkinTime,
        checkoutTime: this.existingBooking.checkoutTime,
        roomType: '',
        roomSize: '',
        roomNumber: '',
        roomPrice: '',
        bookingStatus: this.existingBooking.bookingStatus,
        checkinDone: this.existingBooking.checkinDone,
        checkoutDone: this.existingBooking.checkoutDone,
        groupReservation: this.existingBooking.groupReservation,
        bookingId: this.existingBooking.bookingId,
      });
      this._updateRoomFinder = new RoomFinder(
        this.existingBooking.checkinDate,
        this.existingBooking.checkoutDate,
        this.existingBooking.checkinTime + ':00',
        this.existingBooking.checkoutTime + ':00',
        this.existingBooking.roomDetails
      );
      this.dataService.roomTypes(this._updateRoomFinder).subscribe((data) => {
        this.roomTypes = data;
        this.reservationForm.get('roomType').enable();
      });

      this.selectedRooms = this.existingBooking.roomDetails;
      this.paymentDetails = this.existingBooking.paymentDetails;
      if (this.checkOutStatus) {
        this.reservationForm.disable();
      }
    }
  }

  addCheckoutDate() {
    this.reservationForm.get('checkinTime').enable();
    this.reservationForm.get('checkoutTime').enable();
  }

  onSetCheckOutTime(checkoutTime: EventEmitter<string>) {
    this._checkinDate = this.reservationForm.get('checkinDate').value;
    this._checkinTime = this.reservationForm.get('checkinTime').value;
    this._checkoutDate = this.reservationForm.get('checkoutDate').value;
    this._checkoutTime = checkoutTime + '';
    this._checkinDateStr = this.dataService.converDateFormat(this._checkinDate);
    this._checkoutDateStr = this.dataService.converDateFormat(
      this._checkoutDate
    );
    this._roomFinder = new RoomFinder(
      this._checkinDateStr,
      this._checkoutDateStr,
      this._checkinTime + ':00',
      this._checkoutTime + ':00',
      this.selectedRooms
    );
    this.dataService.roomTypes(this._roomFinder).subscribe((data) => {
      this.roomTypes = data;
      this.reservationForm.get('roomType').enable();
    });
  }

  onChangeRoomType(roomType: string) {
    this._roomType = roomType;
    if (this.existingBookingId) {
      this._roomFinder = this._updateRoomFinder;
    }
    this._roomFinder.roomType = this._roomType;

    this.dataService.roomSizes(this._roomFinder).subscribe((data) => {
      this.roomSizes = data;
      this.reservationForm.get('roomSize').enable();
    });
  }

  onChangeRoomSize(roomSize: string) {
    this._roomSize = roomSize;
    this._roomFinder.roomSize = this._roomSize;
    this.dataService.roomNumbers(this._roomFinder).subscribe((data) => {
      this.roomNumbers = data;
      this.reservationForm.get('roomNumber').enable();
    });
  }

  onChangeRoomNumber(roomNumber: string) {
    this._roomFinder.roomNo = roomNumber;
    this.dataService.roomPrice(this._roomFinder).subscribe((data) => {
      this.roomPrice = data;
      this.reservationForm.get('roomPrice').setValue(this.roomPrice);
      this.condition = false;
    });
  }

  increment() {
    //console.log(this.reservationForm.get('totalNoOfGuests').value);
    let totalNoOfGuests = this.reservationForm.get('totalNoOfGuests').value;
    //console.log(totalNoOfGuests++);
    this.reservationForm.patchValue({ totalNoOfGuests: ++totalNoOfGuests });
    //console.log("Grp ", this.reservationForm.get('groupReservation').value);
  }

  decrement() {
    let totalNoOfGuests = this.reservationForm.get('totalNoOfGuests').value;
    //console.log(totalNoOfGuests++);
    this.reservationForm.patchValue({ totalNoOfGuests: --totalNoOfGuests });
  }

  addRoom() {
    var selectedRoom = {
      roomType: this.reservationForm.get('roomType').value,
      roomSize: this.reservationForm.get('roomSize').value,
      roomNumber: this.reservationForm.get('roomNumber').value,
      roomCost: this.reservationForm.get('roomPrice').value,
      noOfPersons: this.reservationForm.get('totalNoOfGuests').value,
    };
    //console.log("Selected Room ",selectedRoom);
    this.selectedRooms.push(selectedRoom);
    //this.roomNumbers.splice(this.roomNumbers.indexOf(this.reservationForm.get('roomNumber').value), 1);
    this._diffInDays =
      (this.reservationForm.get('checkoutDate').value.getTime() -
        this.reservationForm.get('checkinDate').value.getTime()) /
      (1000 * 3600 * 24);
    //console.log("Diff ",this._diffInDays);
    this._totalPayableAmount += this._diffInDays * selectedRoom['roomCost'];
    console.log('Total Payable Amt ', this._totalPayableAmount);
    this.reservationForm.patchValue({
      amountDue: this._totalPayableAmount,
      totalPayableAmount: this._totalPayableAmount,
      totalNoOfGuests: 1,
      roomType: '',
      roomSize: '',
      roomNumber: '',
      roomPrice: +'',
    });
    this.reservationForm.get('roomType').disable();
    this.reservationForm.get('roomSize').disable();
    this.reservationForm.get('roomNumber').disable();
    this.condition = true;
    this._roomFinder.selectedRooms = this.selectedRooms;
    this.dataService.roomTypes(this._roomFinder).subscribe((data) => {
      this.roomTypes = data;
      this.reservationForm.get('roomType').enable();
    });
    this.showHide = true;
  }

  deleteRow(index) {
    //console.log(this.selectedRooms[index]);
    this._totalPayableAmount -=
      this._diffInDays * this.selectedRooms[index].roomCost;
    this.reservationForm.patchValue({
      totalPayableAmount: this._totalPayableAmount,
    });
    this.roomTypes.indexOf(this.selectedRooms[index].roomType) === -1
      ? this.roomTypes.push(this.selectedRooms[index].roomType)
      : '';
    this.roomSizes.indexOf(this.selectedRooms[index].roomSize) === -1
      ? this.roomSizes.push(this.selectedRooms[index].roomSize)
      : '';
    this.roomNumbers.push(this.selectedRooms[index].roomNumber);
    this.selectedRooms.splice(index, 1);
    if (this.selectedRooms.length == 0) this.showHide = false;
  }

  pay() {
    var currentDateStr = this.bookingDataService.converDateFormat(new Date());
    console.log(currentDateStr);
    var paymentDetail = {
      paymentDate: this.bookingDataService.converDateFormat(new Date()),
      paymentMode: this.reservationForm.get('paymentMode').value,
      paymentAmount: this.reservationForm.get('paidAmount').value,
    };
    this.paymentDetails.push(paymentDetail);
    this.reservationForm.patchValue({
      amountDue:
        this.reservationForm.get('totalPayableAmount').value -
        this.reservationForm.get('paidAmount').value,
      paymentAmount: +'',
      paymentMode: '',
    });
  }

  onSubmit() {
    //console.log(this.reservationForm.value);
    this.submitted = true;
    if (this.existingBookingId && this.reservationForm.valid) {
      this.bookingDataService
        .updateData(
          this.reservationForm.getRawValue(),
          this.selectedRooms,
          this.paymentDetails
        )
        .subscribe((data) => {
          Swal.fire(
            'Booking with :- ' + data,
            'Updated succesfully!!',
            'success'
          ).then(() => {
            this.location.back();
          });
        });
    } else if (this.reservationForm.valid) {
      this.bookingDataService
        .saveData(
          this.reservationForm.getRawValue(),
          this.selectedRooms,
          this.paymentDetails
        )
        .subscribe((data) => {
          Swal.fire(
            'Booking with :- ' + data,
            'added succesfully!!',
            'success'
          ).then(() => {
            this.location.back();
          });
        });
    }
  }

  onReset() {
    this.reservationForm.reset();
  }

  onClose() {
    this.location.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.reservationForm.controls[controlName].hasError(errorName);
  };
}
