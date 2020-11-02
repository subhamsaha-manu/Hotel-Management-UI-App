import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Booking{
  constructor(
      public guestName : string,
      public guestIdType : string,
      public guestIdNo : string,
      public noOfPersons : number,
      public dateFrom : string,
      public dateTo : string,
      public roomNo : string,
      public roomSize : string,
      public roomType : string,
      public fullPaymentDone : boolean,
      public bookingStatus : string,
      public paymentAmount : number,
      public checkinDone : boolean =false,
      public checkOutDone : boolean = false,
      public bookingId? : string
  ){}
}
