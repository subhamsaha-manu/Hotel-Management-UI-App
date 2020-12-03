import { InvoiceComponent } from './invoice/invoice.component';

export const routes = [{
    path: '',
    children: [{
        path: 'invoice/:id',
        component: InvoiceComponent
    }]
}];