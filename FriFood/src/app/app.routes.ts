import { Cart } from './cart/cart';
import { Home } from './home/home';
import { Payment } from './payment/payment';
import { Profile } from './profile/profile';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: Cart },
  { path: 'payment', component: Payment },
  { path: 'profile', component: Profile },
];
