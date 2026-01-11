export const environment = {
  production: false,

  // Google Maps API key for local docker dev (optional)
  googleMapsApiKey: '',

  // When the SPA runs in your browser (localhost:4200), it must call backends via host-exposed ports.
  apiGatewayUrl: 'http://localhost:9000',
} as const;
