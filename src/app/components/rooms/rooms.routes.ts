import { RoomsFormComponent } from './rooms-form/rooms-form.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';


export const routes = [{
    path: '',
    children: [{
        path: '',
        component: RoomsListComponent
    }, {
        path: 'create',
        component: RoomsFormComponent
    }, {
        path: 'edit/:id',
        component: RoomsFormComponent
    }, {
        path: 'view/:id',
        component: RoomsListComponent
    }]
}];
