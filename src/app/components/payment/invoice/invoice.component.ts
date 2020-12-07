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
          fontSize: 16,
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
              { text: this.existingBooking.firstLine },
              { text: this.existingBooking.email },
              { text: this.existingBooking.phone }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              { 
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
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
            widths: ['auto', 'auto', 'auto', 'auto','*'],
            body: [
              ['Sl.No', 'Room-Type', 'Room-Size', 'Room-Number','Rate'],
              /*...this.existingBooking.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),*/
              [1,this.existingBooking.roomType,this.existingBooking.roomSize,this.existingBooking.roomNumber,5000],
              [{text: 'Total Amount', colSpan: 4}, {}, {}, {},/*this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)*/5000]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.existingBooking.checkinDate + '-' + this.existingBooking.checkoutDate,
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
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
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
   
    pdfMake.createPdf(docDefinition).open();
  }

  close(){
    this.location.back();
  }
}
