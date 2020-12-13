import { Injectable } from '@angular/core';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root'
})

export class Booking{
  constructor(
      public guestName : string,
      public email : string,
      public phone : string,
      public address : string,
      public city : string,
      public state : string,
      public country : string,
      public zip : string,      
      public idType : string,
      public idNumber : string,
      public checkinDate : string,
      public checkinTime : string,
      public checkoutDate : string,
      public checkoutTime : string,
      public totalNoOfGuests:number,
      public paymentAmount : number,
      public groupReservation : boolean,
      public internationalGuests : boolean,
      public roomDetails?:Array<Room>,      
      public totalPaymentAmount? : number,       
      public checkinDone : boolean =false,
      public checkoutDone : boolean = false,
      public bookingId? : string,          
      public bookingStatus : string="",
  ){}
}
