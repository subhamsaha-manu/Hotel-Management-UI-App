import { Component, OnInit } from '@angular/core';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';

export interface Guest{
  id : string,
  guestName : string,
  roomNumber : string
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  public options: any;
  public checkinGuestList : Array<Guest> = [];
  public checkoutGuestList : Array<Guest> = [];
  constructor( private bookingDataService: BookingsDataService) {

    var currentDate = new Date();
    var guestDetail : Guest;
    var currentDateStr = currentDate.toISOString().substring(0,currentDate.toISOString().indexOf('T')) 
    console.log("date ",currentDate.toISOString().substring(0,currentDate.toISOString().indexOf('T')));
    var checkedInGuest : number = 0;
    var paymentPending : number = 0;
    var paymentComplete : number = 0;
    this.bookingDataService.bookings.forEach(ele =>{
      if(ele.checkinDone === true)
        checkedInGuest++;
      if(true)
        paymentComplete++;
      else
        paymentPending++;
      if(ele.checkinDate === currentDateStr){
        guestDetail = {
          id : ele.bookingId,
          guestName : ele.guestName,
          roomNumber : ''
        }
        this.checkinGuestList.push(guestDetail)
      }
      if(ele.checkoutDate === currentDateStr){
        guestDetail = {
          id : ele.bookingId,
          guestName : ele.guestName,
          roomNumber : ''
        }
        this.checkoutGuestList.push(guestDetail)
      }
    });

    console.log("Values ",checkedInGuest+" "+paymentPending+" "+paymentComplete)

    this.options = {
      data: [
        { 
          label:'Checked-in Guest',
          value: checkedInGuest 
        },
        { 
          label:'Payment Pending',
          value: paymentPending 
        },
        { 
          label:'Payment Complete',
          value: paymentComplete 
        }
      ],
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          labelKey: 'label',
          label:{
            enabled : false
          },
          fills:['#98FB98', '#FF6347', '#87CEFA']
        },
      ]
    };
  }


  ngOnInit(): void {
  }

}
