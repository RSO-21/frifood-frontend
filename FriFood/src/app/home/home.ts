import {
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';

import { GoogleMapsLoaderService } from '../services/googlemapsloader';
import { OrderService } from '../services/order.service';
import { PartnerService } from '../services/partner.service';
import { Partners } from '../partners/partners';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
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

  private autocomplete: any;
  private selectedPlace: any;
  private addressSelected: boolean = false;

  private platformId = inject(PLATFORM_ID);
  private partnerService = inject(PartnerService);

  private userService = inject(UserService);
  private gmaps = inject(GoogleMapsLoaderService);

  user = this.userService.user;

  constructor() {
    effect(() => {
      const user = this.userService.user();

      if (!user) return;

      if (user.latitude && user.longitude) {
        this.partnerService
          .getNearbyPartners({
            lat: user.latitude,
            lng: user.longitude,
            radius_km: 5,
          })
          .subscribe((partners) => {
            this.partnerService.setPartners(partners);
          });
      }
    });
  }

  async ngAfterViewInit() {
    //  Skip on server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.autocomplete) {
      return; // already initialized
    }
    var g = (window as any).google;
    if (!g?.maps?.places) {
      try {
        await this.gmaps.loadPlaces();
        g = (window as any).google;
      } catch (e) {
        console.error('Failed to load Google Maps Places', e);
      }
    }

    this.autocomplete = new g.maps.places.Autocomplete(this.addressInput.nativeElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'si' }, // optional
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();

      // reject free text
      if (!place?.geometry) {
        this.addressInput.nativeElement.value = '';
        this.selectedPlace = null;
        return;
      }

      this.selectedPlace = place;
      this.findOffers();
    });

    // prevent Enter key submitting garbage
    this.addressInput.nativeElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
      this.addressSelected = false;
    });
  }

  findOffers(): void {
    if (!this.selectedPlace) {
      alert('Izberi naslov iz seznama.');
      return;
    }

    const location = this.selectedPlace.geometry.location;

    const lat = location.lat();
    const lng = location.lng();

    if (lat && lng) {
      this.partnerService.getNearbyPartners({ lat, lng, radius_km: 5 }).subscribe((partners) => {
        this.partnerService.setPartners(partners);
      });
      this.userService.updateUser(this.userService.user_id(), {
        latitude: lat,
        longitude: lng,
        address: this.selectedPlace.formatted_address,
      });
    } else {
      this.partnerService.listPartners().subscribe((partners) => {});
    }
  }
}
