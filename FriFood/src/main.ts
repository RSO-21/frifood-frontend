import { App } from './app/app';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';

// function loadGoogleMaps(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if ((window as any).google?.maps) {
//       resolve();
//       return;
//     }

//     const script = document.createElement('script');
//     script.src =
//       `https://maps.googleapis.com/maps/api/js` +
//       `?key=${environment.googleMapsApiKey}` +
//       `&libraries=places`;
//     script.async = true;
//     script.defer = true;

//     script.onload = () => resolve();
//     script.onerror = () => reject('Google Maps failed to load');

//     document.head.appendChild(script);
//   });
// }
// loadGoogleMaps()
//   .then(() => {
//     bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//   })
//   .catch((error) => {
//     console.error(error);
//   });

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
