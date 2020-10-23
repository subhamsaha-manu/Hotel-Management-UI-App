import { BookingsDetailComponent } from './bookings-detail/bookings-detail.component';
import { BookingsFormComponent } from './bookings-form/bookings-form.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';

export const routes = [{
    path: '',
    children: [{
        path: '',
        component: BookingsListComponent
    }, {
        path: 'create',
        component: BookingsFormComponent
    }, {
        path: 'edit/:id',
        component: BookingsFormComponent
    }, {
        path: 'view/:id',
        component: BookingsDetailComponent
    }]
}];