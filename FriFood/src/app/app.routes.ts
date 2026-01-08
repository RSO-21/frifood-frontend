import { Cart } from './cart/cart';
import { Home } from './home/home';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: Cart },
];
