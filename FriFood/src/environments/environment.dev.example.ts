export const environment = {
  production: false,
  googleMapsApiKey: '',

  // AKS dev ingress URLs (host-based)
  apiGatewayUrl: 'http://api.fri-food-dev.4.165.160.2.nip.io',
  authServiceUrl: 'http://auth-dev.4.165.160.2.nip.io',
  userServiceUrl: 'http://users-dev.4.165.160.2.nip.io/',
  orderServiceUrl: 'http://orders-dev.4.165.160.2.nip.io',
  offerServiceUrl: 'http://offers-dev.4.165.160.2.nip.io',
  paymentServiceUrl: 'http://payments-dev.4.165.160.2.nip.io',
  partnerServiceUrl: 'http://partners-dev.4.165.160.2.nip.io',
  notificationServiceUrl: 'http://notifications-dev.4.165.160.2.nip.io',
  reviewServiceUrl: 'http://reviews-dev.4.165.160.2.nip.io'
} as const;
