import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Menu, MenuAdapter } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  private baseUrl = "http://192.168.0.105:8081/booking/api";

  constructor(private http: HttpClient, private adapter: MenuAdapter) { }

  menuList(): Observable<Menu[]> {
    const url = this.baseUrl;
    return this.http
      .get(url)
      .pipe(map((data: any[]) => data.map(item => this.adapter.adapt(item))));
  }

  roomTypes(checkinDate: Date,checkinTime: string, checkoutDate: Date, checkoutTime: string, bookingId?: string): Observable<String> {
    const url = this.baseUrl + "/findRoomTypes";
    let params = new HttpParams();
    //console.log("Service roomTypes ",dateFrom+" "+dateTo)
    
    params = params.append('checkinDate', this.converDateFormat(checkinDate));
    params = params.append('checkinTime', checkinTime+":00");
    params = params.append('checkoutDate', this.converDateFormat(checkoutDate));
    params = params.append('checkoutTime', checkoutTime+":00");
    params = params.append('bookingId', bookingId);

    return this.http.get<String>(url, { params: params });
  }

  roomSizes(checkinDate: Date,checkinTime: string, checkoutDate: Date, checkoutTime: string,roomType:string,bookingId?: string): Observable<String> {
    const url = this.baseUrl + "/findRoomSizes";
    let params = new HttpParams();
    //console.log("Service roomSizes ",dateFrom+" "+dateTo+" "+roomType)

    params = params.append('checkinDate', this.converDateFormat(checkinDate));
    params = params.append('checkinTime', checkinTime+":00");
    params = params.append('checkoutDate', this.converDateFormat(checkoutDate));
    params = params.append('checkoutTime', checkoutTime+":00");
    params = params.append('roomType', roomType);
    params = params.append('bookingId', bookingId);

    return this.http.get<String>(url, { params: params });
  }

  roomNumbers(checkinDate: Date,checkinTime: string, checkoutDate: Date, checkoutTime: string,roomType: string,roomSize: string,bookingId?: string): Observable<String> {
    const url = this.baseUrl + "/findRoomNumbers";
    let params = new HttpParams();
    //console.log("Service roomNumbers ",dateFrom+" "+dateTo+" "+" "+roomType+" "+roomSize)

    params = params.append('checkinDate', this.converDateFormat(checkinDate));
    params = params.append('checkinTime', checkinTime+":00");
    params = params.append('checkoutDate', this.converDateFormat(checkoutDate));
    params = params.append('checkoutTime', checkoutTime+":00");
    params = params.append('roomType', roomType)
    params = params.append('roomSize', roomSize)
    params = params.append('bookingId', bookingId);

    return this.http.get<String>(url, { params: params });
  }


  converDateFormat(date: Date): string {
    var month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
