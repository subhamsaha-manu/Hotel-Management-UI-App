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

  roomTypes(dateFrom: string, dateTo: string): Observable<String> {
    const url = this.baseUrl + "/findRoomTypes";
    let params = new HttpParams();
    //console.log("Service roomTypes ",dateFrom+" "+dateTo)
    dateFrom = "2020-11-01T22:22:22"
    dateTo="2020-11-02T22:22:22"
    params = params.append('dateFrom', dateFrom);
    params = params.append('dateTo', dateTo);

    return this.http.get<String>(url, { params: params });
  }

  roomSizes(dateFrom: string, dateTo: string,roomType:string): Observable<String> {
    const url = this.baseUrl + "/findRoomSizes";
    let params = new HttpParams();
    //console.log("Service roomSizes ",dateFrom+" "+dateTo+" "+roomType)
    dateFrom = "2020-11-01T22:22:22"
    dateTo="2020-11-02T22:22:22"
    params = params.append('dateFrom', dateFrom);
    params = params.append('dateTo', dateTo);
    params = params.append('roomType', roomType);

    return this.http.get<String>(url, { params: params });
  }

  roomNumbers(dateFrom: string, dateTo: string,roomType: string,roomSize: string): Observable<String> {
    const url = this.baseUrl + "/findRoomNumbers";
    let params = new HttpParams();
    //console.log("Service roomNumbers ",dateFrom+" "+dateTo+" "+" "+roomType+" "+roomSize)
    dateFrom = "2020-11-01T22:22:22"
    dateTo="2020-11-02T22:22:22"
    params = params.append('dateFrom', dateFrom);
    params = params.append('dateTo', dateTo);
    params = params.append('roomType', roomType)
    params = params.append('roomSize', roomSize)

    return this.http.get<String>(url, { params: params });
  }
}
