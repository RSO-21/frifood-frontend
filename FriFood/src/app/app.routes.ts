import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Discovery } from './discovery/discovery';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'discovery', component: Discovery }
];
