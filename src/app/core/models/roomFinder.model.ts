import { Injectable } from '@angular/core';
import { Room } from './room.model';

@Injectable({
    providedIn: 'root'
})

export class RoomFinder {

    constructor(
         public checkinDate: string,
         public checkoutDate: string,
         public checkinTime: string,
         public checkoutTime: string,
         public selectedRooms?: Array<Room>,
         public roomType?: string,
         public roomSize?: string,
         public roomNo?: string,
         public bookingId?:string) {
    }

    private converDateFormat(date: Date): string {
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
