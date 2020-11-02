import { Component, OnInit } from '@angular/core';
import { BookingsDataService } from 'src/app/core/services/bookings-data.service';
import { Booking } from 'src/app/core/models/booking.model';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { BookingsFormComponent } from '../bookings-form/bookings-form.component';
import { Router } from '@angular/router';
import { UpdateButtonComponent } from '../../update-button/update-button.component';
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
  constructor(private bookingDataService: BookingsDataService,private router: Router) {

    this.getRowNodeId = function (data) {
      return data.id;
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
    { headerName: 'BookingId', field: 'bookingId' },
    { headerName: 'Guest Name', field: 'guestName' },
    { headerName: 'CheckIn', field: 'dateFrom' },
    { headerName: 'CheckOut', field: 'dateTo' },
    { headerName: 'Full Payment Done', field: 'fullPaymentDone' },
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
  onRowClicked(event: any) {
    console.log('row',event.data);
    
  }

  checkoutSelected(){

  }

  makeNewBooking(){
    this.router.navigateByUrl('/bookings/create');
  }
}
