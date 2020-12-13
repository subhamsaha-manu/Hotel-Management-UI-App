import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Room {
    constructor(
        public roomType: string,
        public roomSize: string,
        public roomNumber: string,
        public roomCost: number,
        public noOfPersons:number
    ) { }
}