import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Booking{
  constructor(
      public firstName : string,
      public middleName : string,
      public lastName : string,
      public firstLine : string,
      public secondLine : string,
      public city : string,
      public state : string,
      public zip : number,
      public phone : number,
      public email : string,
      public idType : string,
      public idNumber : string,
      public adults : number,
      public child : number,
      public checkinDate : string,
      public checkinTime : string,
      public checkoutDate : string,
      public checkoutTime : string,
      public fullPaymentDone : boolean,
      public paymentAmount : number,
      public roomNumber : string,
      public roomType : string,
      public roomSize : string,            
      public bookingStatus : string,      
      public checkinDone : boolean =false,
      public checkoutDone : boolean = false,
      public bookingId? : string,
      public guestName? : string
  ){}
}
