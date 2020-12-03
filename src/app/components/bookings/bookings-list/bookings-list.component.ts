import { Component, NgZone, OnInit } from '@angular/core';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Booking } from 'src/app/core/models/booking.model';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Router } from '@angular/router';
import { UpdateButtonComponent } from '../../update-button/update-button.component';
import { MatDialog } from '@angular/material/dialog';

import { CheckinCheckoutHandlerComponent } from '../checkin-checkout-handler/checkin-checkout-handler.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css']
})
export class BookingsListComponent {

  modules = [ClientSideRowModelModule];
  public paginationPageSize;
  public defaultColDef;
  public domLayout;
  public frameworkComponents;
  private gridApi;
  private gridColumnApi;
  public tooltipShowDelay;
  public rowSelection;
  public getRowNodeId;
  public groupHeaderHeight;
  public headerHeight;
  public rowHeight;

  rowData: Booking[];
  public rowClassRules;
  constructor(public dialog: MatDialog, private bookingDataService: BookingsDataService, private router: Router) {

    this.getRowNodeId = function (data) {
      return data.bookingId;
    };
    this.domLayout = 'normal';
    this.tooltipShowDelay = 100;
    this.rowSelection = 'single';

    this.frameworkComponents = {
      btnCellRenderer: UpdateButtonComponent
    };
    //console.log("Called const");

    this.groupHeaderHeight = 75;
    this.headerHeight = 50;
    this.rowHeight = 40;
    this.defaultColDef = {resizeable:true}
  }


  columnDefs = [
    {
      headerName: 'Reservations',
      children: [
        {
          headerName: '', field: '',checkboxSelection: true,width: 50
        },
        {
          headerName: 'Update',cellRenderer: 'btnCellRenderer',
          cellRendererParams: {
            clicked: function () {
            }
          },
          width: 100
        },
        {
          headerName: 'Booking Id', field: 'bookingId', width: 150
        },
        { headerName: 'Guest Name', field: 'guestName' },
        { headerName: 'Phone', field: 'phone' },
        { headerName: 'Room-No', field: 'roomNumber',width:150 },
        { headerName: 'CheckOut', field: 'checkoutDate' },
        { headerName: 'CheckOut', field: 'checkoutDate' }
      ]
    }
  ];

  getRowStyle(params) {
    if (params.data.bookingStatus === 'CANCEL') {
      return { 'background-color': '#E0E0E0' }
    } else if (params.data.fullPaymentDone === false) {
      return { 'background-color': '#FF9999' };
    } else if (params.data.fullPaymentDone === true) {
      return { 'background-color': '#CCFFCC' }
    }
  }

  onFirstDataRendered(params){
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    setTimeout(() => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      //console.log("On grid ready ", this.bookingDataService.bookings)
      this.rowData = this.bookingDataService.bookings;
    }, 100);
    //this.renderTable();   
  }
  onRowClicked(event) {
    //console.log('row', event.data);
    if (event.data.bookingStatus === 'CANCEL') {
      Swal.fire('Warning!!', 'Cannot modify cancelled booking', 'warning')
    } else {
      new NgZone({}).run(() => this.router.navigateByUrl('/bookings/edit/' + event.data.bookingId));
    }
  }

  checkInCheckOutHandler() {
    var selectedRow = this.gridApi.getSelectedRows();
    if (selectedRow.length == 0) {
      Swal.fire('Info', 'Need to select atleast a row', 'info')
    }
    else if (selectedRow.length > 1) {
      Swal.fire('Info', 'Select only one row', 'info')
    } else {
      if (selectedRow[0].bookingStatus === 'CANCEL') {
        Swal.fire('Warning', 'Cannot modify cancelled booking', 'warning')
      } else {
        this.dialog.open(CheckinCheckoutHandlerComponent, {
          data: { bookingId: selectedRow[0].bookingId }
        });
      }
    }
  }

  makeNewBooking() {
    this.router.navigateByUrl('/bookings/create');
  }

  generateInvoice(){
    var selectedRow = this.gridApi.getSelectedRows();
    if (selectedRow.length == 0) {
      Swal.fire('Info', 'Need to select atleast a row', 'info')
    }else{
      this.router.navigateByUrl('/payment/invoice/'+selectedRow[0].bookingId );
    }    
  }
}


//https://code-maze.com/angular-material-form-validation/
//https://www.concretepage.com/angular-material/angular-material-datepicker-validation#Custom