import { Component, ElementRef, PLATFORM_ID, ViewChild, inject } from '@angular/core';

import { PartnerService } from '../services/partner.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
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
  private router = inject(Router);

  ngAfterViewInit(): void {
    //  Skip on server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.autocomplete) {
      return; // already initialized
    }
    const g = (window as any).google;

    if (!g?.maps?.places) {
      console.warn('Google Maps Places API not available');
      return;
    }

    this.autocomplete = new g.maps.places.Autocomplete(this.addressInput.nativeElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'si' }, // optional
    });

    this.autocomplete.addListener('place_changed', () => {
      console.log('Place changed');
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

    console.log('Address:', this.selectedPlace.formatted_address);
    console.log('Lat:', lat, 'Lng:', lng);

    if (lat && lng) {
      this.partnerService.getNearbyPartners({ lat, lng, radius_km: 5 }).subscribe((partners) => {
        this.partnerService.setPartners(partners);
        this.router.navigate(['/discovery']);
      });
    } else {
      this.partnerService.listPartners().subscribe((partners) => {
        console.log('All partners:', partners);
      });
    }
  }
}
