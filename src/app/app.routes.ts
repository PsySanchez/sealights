import { Routes } from '@angular/router';
import { ClientListComponent, ClientComponent } from './components';

export const routes: Routes = [
  {
    path: 'clients',
    component: ClientListComponent,
  },
  {
    path: 'client/:id',
    component: ClientComponent,
  },
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'clients',
  },
];
