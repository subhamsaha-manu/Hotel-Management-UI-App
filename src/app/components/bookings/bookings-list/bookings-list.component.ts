import { Component, OnInit } from '@angular/core';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Booking } from 'src/app/core/models/booking.model';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { BookingsFormComponent } from '../bookings-form/bookings-form.component';
import { Router } from '@angular/router';
import { UpdateButtonComponent } from '../../update-button/update-button.component';
import { MatDialog } from '@angular/material/dialog';
import { CheckinCheckoutHandlerComponent } from '../checkin-checkout-handler/checkin-checkout-handler.component';
@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css']
})
export class BookingsListComponent implements OnInit {

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

  rowData: Booking[];
  constructor(public dialog: MatDialog,private bookingDataService: BookingsDataService,private router: Router) {

    this.getRowNodeId = function (data) {
      return data.bookingId;
    };
    this.domLayout = 'autoHeight';
    this.tooltipShowDelay =100;
    this.rowSelection = 'multiple';
    
    this.frameworkComponents = {
      btnCellRenderer: UpdateButtonComponent
    };
   }

  ngOnInit(): void {
    this.bookingDataService.fetchData()
  }

  columnDefs = [
    { headerName:'',field:'',checkboxSelection:true,width:50},
    { headerName: 'BookingId', field: 'bookingId',width:100},
    { headerName: 'Guest Name', field: 'guestName'},
    { headerName: 'CheckIn', field: 'checkinDate' },
    { headerName: 'CheckOut', field: 'checkoutDate' },
    { headerName: 'Full Payment Done', field: 'fullPaymentDoneStr' },
    {
      headerName: 'Update',
      cellRenderer: 'btnCellRenderer',
      cellRendererParams: {
        clicked: function () {  
        }
      },
      width:100
    }
  ];

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    console.log(this.bookingDataService.bookings)
    this.rowData = this.bookingDataService.bookings;
    //this.renderTable();   
  }
  onRowClicked(event) {
    console.log('row',event.data);
    this.router.navigateByUrl('/bookings/edit/'+event.data.bookingId);
  }

  checkInCheckOutHandler(){
    var selectedRow = this.gridApi.getSelectedRows();
    console.log(selectedRow[0].bookingId)
    if(selectedRow.length == 1){
      this.dialog.open(CheckinCheckoutHandlerComponent,{
        data: {bookingId:selectedRow[0].bookingId}
      });
    }
  }

  makeNewBooking(){
    this.router.navigateByUrl('/bookings/create');
  }
}
