export const environment = {
  production: false,
  googleMapsApiKey: '',

  // AKS dev ingress URLs (host-based)
  apiGatewayUrl: 'http://api.fri-food-dev.68.210.120.104.nip.io',
  authServiceUrl: 'http://auth-dev.68.210.120.104.nip.io',
  userServiceUrl: 'http://users-dev.68.210.120.104.nip.io',
  orderServiceUrl: 'http://orders-dev.68.210.120.104.nip.io',
  offerServiceUrl: 'http://offers-dev.68.210.120.104.nip.io',
  paymentServiceUrl: 'http://payments-dev.68.210.120.104.nip.io',
  partnerServiceUrl: 'http://partners-dev.68.210.120.104.nip.io',
  notificationServiceUrl: 'http://notifications-dev.68.210.120.104.nip.io',
  reviewServiceUrl: 'http://reviews-dev.68.210.120.104.nip.io',
} as const;
