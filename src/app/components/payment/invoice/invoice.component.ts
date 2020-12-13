import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/core/models/booking.model';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Location } from '@angular/common';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  
  existingBookingId: string;  
  existingBooking: Booking;

  constructor(private bookingDataService: BookingsDataService,private route: ActivatedRoute,private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.existingBookingId = params['id'];
    });

    this.existingBooking = this.bookingDataService.bookings.find(data => data.bookingId === this.existingBookingId);

    console.log(this.existingBooking.guestName);
  }

  print(){
    let docDefinition = {
      content: [
        {
          text: 'HOTEL',
          fontSize: 30,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.existingBooking.guestName,
                bold:true
              },
              { text: this.existingBooking.address },
              { text: this.existingBooking.email },
              { text: this.existingBooking.phone }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              { 
                text: `Booking Id : ${this.existingBooking.bookingId}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Booking Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto','auto','*'],
            body: [
              [
                {text:'Sl.No',alignment:'center',bold:true,fillColor:'#f9f9fb'},
                {text:'Room-Type',alignment:'center',bold:true,fillColor:'#f9f9fb'},
                {text:'Room-Size',alignment:'center',bold:true,fillColor:'#f9f9fb'},
                {text:'Room-Number',alignment:'center',bold:true,fillColor:'#f9f9fb'},
                {text:'Guest',alignment:'center',bold:true,fillColor:'#f9f9fb'},
                {text:'Rate',alignment:'center',bold:true,fillColor:'#f9f9fb'}],
              ...this.existingBooking.roomDetails.map((ele,index) => ([index+1,ele.roomType, ele.roomSize, ele.roomNumber,ele.noOfPersons, {text:ele.roomCost,alignment:'center'}])),
              //[1,this.existingBooking.roomType,this.existingBooking.,this.existingBooking.roomNumber,5000],
              [{text: 'Total Payable Amount', colSpan: 5}, {}, {}, {},{},{text:this.existingBooking.totalPaymentAmount,alignment:'center'}]
            ]
          }
        },
        {
          text: 'CheckIn CheckOut Details',
          style: 'sectionHeader'
        },
        {
            text: this.existingBooking.checkinDate + '  --  ' + this.existingBooking.checkinTime+' Hrs',
            margin: [0, 0 ,0, 15]          
        },
        {
          text: this.existingBooking.checkoutDate + '  --  ' + this.existingBooking.checkoutTime+' Hrs',
          margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [{ qr: `${this.existingBooking.guestName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        }
      }
    };
    console.log('Doc Definition ',JSON.stringify(docDefinition));
    pdfMake.createPdf(docDefinition).open();
  }

  close(){
    this.location.back();
  }
}
