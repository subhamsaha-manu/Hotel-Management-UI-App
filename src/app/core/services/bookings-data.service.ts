import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Booking } from '../models/booking.model';
import { PaymentDetail } from '../models/paymentDetails.model';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsDataService {
  private baseUrl = 'http://192.168.0.105:8081/booking/api';

  constructor(private http: HttpClient) {}

  public bookings: Booking[];

  saveData(
    bookingForm,
    selectedRooms: Room[],
    paymentDetails: PaymentDetail[]
  ) {
    var url = this.baseUrl + '/save';
    var booking = this.mapBookingFormToBookingObj(
      bookingForm,
      selectedRooms,
      paymentDetails
    );
    console.log('Selected Rooms in saveData() ', selectedRooms);

    return this.http
      .post(url, booking, { responseType: 'text' })
      .pipe(catchError((err) => this.handleError('saveData', err)));
  }

  updateData(bookingForm, selectedRooms = [], paymentDetails = []) {
    var url = this.baseUrl + '/update';
    console.log(
      'Update Data ',
      JSON.stringify(bookingForm) + ' ' + JSON.stringify(selectedRooms)
    );
    var booking = this.mapBookingFormToBookingObj(
      bookingForm,
      selectedRooms,
      paymentDetails
    );
    return this.http
      .post(url, booking, { responseType: 'text' })
      .pipe(catchError((err) => this.handleError('updateData', err)));
    //console.log(newBooking)
  }

  mapBookingFormToBookingObj(
    bookingForm,
    selectedRooms,
    paymentDetails
  ): Booking {
    var booking = new Booking(
      bookingForm.guestName,
      bookingForm.email,
      bookingForm.phone,
      bookingForm.address,
      bookingForm.city,
      bookingForm.state,
      bookingForm.country,
      bookingForm.zip,
      bookingForm.idType,
      bookingForm.idNumber,
      this.converDateFormat(new Date(bookingForm.checkinDate)),
      bookingForm.checkinTime + ':00',
      this.converDateFormat(new Date(bookingForm.checkoutDate)),
      bookingForm.checkoutTime + ':00',
      0,
      bookingForm.paidAmount,
      bookingForm.groupReservation,
      bookingForm.internationalGuests,
      paymentDetails,
      selectedRooms,
      bookingForm.totalPayableAmount,
      bookingForm.checkinDone,
      bookingForm.checkoutDone,
      bookingForm.bookingId,
      bookingForm.bookingStatus
    );

    return booking;
  }

  /*
    date - Javascript date  eg new Date() = Date Sun Dec 13 2020 23:29:17 GMT+0530 (India Standard Time)
    output - 2020-12-13 
  */
  converDateFormat(date: Date): string {
    var month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  fetchData() {
    var url = this.baseUrl + '/findAll';
    this.http
      .get<Booking[]>(url)
      .pipe(catchError((err) => this.handleError('fetchData', err)))
      .subscribe((response) => {
        response.map((data) => {
          data.checkinTime = data.checkinTime.substring(
            0,
            data.checkinTime.length - 3
          );
          data.checkoutTime = data.checkoutTime.substring(
            0,
            data.checkoutTime.length - 3
          );
        });
        this.bookings = response;
        console.log('List after fetchData() ', this.bookings);
      });
  }

  private handleError(method: string, error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      //console.log(error.error)
      if (JSON.parse(error?.error).code) {
        Swal.fire('Error', JSON.parse(error?.error).message, 'info');
      } else {
        Swal.fire('Error', 'Contact administrator', 'error');
      }
    } else {
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
