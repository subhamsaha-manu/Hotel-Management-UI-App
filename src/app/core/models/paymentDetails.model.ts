import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentDetail {
  constructor(
    public paymentDate: string,
    public paymentMode: string,
    public paymentAmount: number
  ) {}
}
