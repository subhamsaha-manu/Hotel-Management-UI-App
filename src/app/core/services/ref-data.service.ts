import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Menu, MenuAdapter } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  private baseUrl = "http://localhost:3000/menus";

  constructor(private http: HttpClient, private adapter: MenuAdapter) {}

  menuList(): Observable<Menu[]> {
    const url = this.baseUrl;
    return this.http
      .get(url)
      .pipe(map((data: any[]) => data.map(item => this.adapter.adapt(item))));
  }  
}
