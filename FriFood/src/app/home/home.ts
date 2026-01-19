import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { PartnerService } from '../services/partner.service';
import { Partners } from '../partners/partners';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Partners],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {
  @ViewChild('addressInput', { static: true })
  addressInput!: ElementRef<HTMLInputElement>;

  private http = inject(HttpClient);
  private partnerService = inject(PartnerService);
  private userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  suggestions: { description: string; place_id: string }[] = [];
  loading = false;

  constructor() {
    // load nearby partners if user already has location
    effect(() => {
      const user = this.userService.user();
      if (!user || !user.latitude || !user.longitude) return;

      this.partnerService
        .getNearbyPartners({
          lat: user.latitude,
          lng: user.longitude,
          radius_km: 5,
        })
        .subscribe((partners) => {
          this.partnerService.setPartners(partners);
        });
    });
  }

  // -----------------------------
  // Autocomplete input
  // -----------------------------
  onAddressInput(value: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!value || value.length < 2) {
      this.suggestions = [];
      return;
    }

    this.http
      .get<{ description: string; place_id: string }[]>(
        `${environment.apiGatewayUrl}/users/location/autocomplete`,
        { params: { input: value } }
      )
      .subscribe({
        next: (res) => (this.suggestions = res),
        error: () => (this.suggestions = []),
      });
  }

  // -----------------------------
  // User picked suggestion
  // -----------------------------
  selectSuggestion(s: { description: string; place_id: string }) {
    this.addressInput.nativeElement.value = s.description;
    this.suggestions = [];

    this.http
      .get<{
        latitude: number;
        longitude: number;
        formatted_address: string;
      }>(`${environment.apiGatewayUrl}/users/location/place`, {
        params: { place_id: s.place_id },
      })
      .subscribe({
        next: (res) => this.applyLocation(res),
        error: () => alert('Lokacije ni bilo mogoče razrešiti'),
      });
  }

  // -----------------------------
  // Apply resolved location
  // -----------------------------
  private applyLocation(res: { latitude: number; longitude: number; formatted_address: string }) {
    const { latitude, longitude, formatted_address } = res;
    this.partnerService
      .getNearbyPartners({
        lat: latitude,
        lng: longitude,
        radius_km: 5,
      })
      .subscribe((partners) => {
        this.partnerService.setPartners(partners);
      });

    // persist on user
    this.userService.updateUser(this.userService.user_id(), {
      latitude,
      longitude,
      address: formatted_address,
    });
  }
}
