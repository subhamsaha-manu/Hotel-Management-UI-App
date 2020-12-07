import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsDataService } from './core/services/bookings-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class AppComponent implements OnDestroy,OnInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  isMenuOpen: boolean=true;
  @ViewChild('sidenav')sidenav;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private router:Router, private bookingDataService: BookingsDataService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    //console.log("Mobile Query ",this.mobileQuery.matches)
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('',this._mobileQueryListener);
  }
  ngOnInit(){
    this.bookingDataService.fetchData();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('',this._mobileQueryListener);
  }

  navigateToHome(){
    this.router.navigateByUrl('/');
  }

  onSidenavClick(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.sidenav.toggle();
    //console.log(`Menu open ${this.isMenuOpen}`);
  }
  
}