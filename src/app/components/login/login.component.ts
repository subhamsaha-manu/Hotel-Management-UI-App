import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Typewriter from 't-writer.js'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit(): void {

    const target = document.querySelector('.tw');

    const writer = new Typewriter(target, {
      loop: true,
      typeColor: '#1E90FF'
    })

    writer.type('Welcome to Hotel Management Solutions').rest(500).start();
  }

  viewDashboard(){
    this.router.navigateByUrl('/dashboard');
  }

  viewBookings(){
    this.router.navigateByUrl('/bookings');
  }

}
