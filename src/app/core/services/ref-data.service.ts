import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Menu, MenuAdapter } from '../models/menu.model';
import { RoomFinder } from '../models/roomFinder.model';

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

  roomTypes(roomFinder : RoomFinder): Observable<String> {
    const url = this.baseUrl + "/findRoomTypes";
    console.log("Room Finder in roomType() ",roomFinder);
    return this.http.post<String>(url,roomFinder);
  }

  roomSizes(roomFinder : RoomFinder): Observable<String> {
    const url = this.baseUrl + "/findRoomSizes";
    console.log("Room Finder in roomSizes() ",roomFinder);
    return this.http.post<String>(url,roomFinder);
  }

  roomNumbers(roomFinder : RoomFinder): Observable<String> {
    const url = this.baseUrl + "/findRoomNumbers";
    console.log("Room Finder in roomNumbers() ",roomFinder);

    return this.http.post<String>(url,roomFinder);
  }

  roomPrice(roomFinder : RoomFinder): Observable<Number> {
    const url = this.baseUrl + "/findRoomPrice";
    console.log("Room Finder in roomPrice() ",roomFinder);

    return this.http.post<Number>(url,roomFinder);
  }


  public converDateFormat(date: Date): string {
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
