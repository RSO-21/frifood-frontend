import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loadingPromise: Promise<void> | null = null;

  loadPlaces(): Promise<void> {
    console.log('Loading Google Maps Places API');
    // Already fully loaded
    if ((window as any).google?.maps?.places) {
      return Promise.resolve();
    }

    // Load already in progress
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        `https://maps.googleapis.com/maps/api/js` +
        `?key=${environment.googleMapsApiKey}` +
        `&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if ((window as any).google?.maps?.places) {
          resolve();
        } else {
          reject('Google Maps loaded but Places API missing');
        }
      };

      script.onerror = () => reject('Google Maps failed to load');

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }
}
