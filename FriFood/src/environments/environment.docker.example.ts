export const environment = {
  production: false,

  // Google Maps API key for local docker dev (optional)
  googleMapsApiKey: '',

  // When the SPA runs in your browser (localhost:4200), it must call backends via host-exposed ports.
  apiGatewayUrl: 'http://localhost:9000',
  authServiceUrl: 'http://localhost:8005',
  userServiceUrl: 'http://localhost:8004',
  orderServiceUrl: 'http://localhost:8002',
  offerServiceUrl: 'http://localhost:8001',
  paymentServiceUrl: 'http://localhost:8003',
  partnerServiceUrl: 'http://localhost:8000',
  notificationServiceUrl: 'http://localhost:8006',
  reviewServiceUrl: 'http://localhost:8007'
} as const;
