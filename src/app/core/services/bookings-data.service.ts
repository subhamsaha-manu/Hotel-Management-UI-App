import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsDataService {

  private baseUrl = "http://192.168.0.105:8081/booking/api";
  

  constructor(private http: HttpClient) { }

  public bookings:Booking[]

  saveData(bookingForm){
    var url = this.baseUrl + "/save";
    var newBooking = new Booking(
      bookingForm.firstName + bookingForm.middleName + bookingForm.lastName,
      bookingForm.contactInfo.idType,
      bookingForm.contactInfo.idNumber,
      +bookingForm.guestDetails.adults + +bookingForm.guestDetails.child,
      this.converDateFormat(bookingForm.bookingDetails.checkin),
      this.converDateFormat(bookingForm.bookingDetails.checkout),
      bookingForm.bookingDetails.roomNumber,
      bookingForm.bookingDetails.roomSize,
      bookingForm.bookingDetails.roomType,
      bookingForm.guestDetails.paymentStatus,
      bookingForm.bookingDetails.bookingStatus,
      bookingForm.guestDetails.paymentAmount);

      this.http.post<Booking>(url,newBooking).subscribe(data=>{
        console.log(data);
      })
    //console.log(newBooking)
  }

  converDateFormat(date:Date):string{
    var formatedDate:string ="";
    formatedDate+= date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    var today = new Date();
    formatedDate+="T"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return formatedDate;
  }

  fetchData(){
    var url = this.baseUrl + "/findAll"
    return this.http.get<Booking[]>(url).subscribe(data =>{
      this.bookings = data
    })
  }
}
