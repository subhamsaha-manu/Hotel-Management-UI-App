import { DashboardHomeComponent } from "./dashboard-home/dashboard-home.component";


export const routes = [{
    path: '',
    children: [{
        path: '',
        component: DashboardHomeComponent
    }]
}];
