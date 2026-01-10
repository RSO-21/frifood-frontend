export const environment = {
  production: true,
  googleMapsApiKey: '',

  // AKS prod ingress URLs (same as dev but without '-dev')
  apiGatewayUrl: 'http://api.fri-food.4.165.160.2.nip.io',
  authServiceUrl: 'http://auth.4.165.160.2.nip.io',
  userServiceUrl: 'http://users.4.165.160.2.nip.io',
  orderServiceUrl: 'http://orders.4.165.160.2.nip.io',
  offerServiceUrl: 'http://offers.4.165.160.2.nip.io',
  paymentServiceUrl: 'http://payments.4.165.160.2.nip.io',
  partnerServiceUrl: 'http://partners.4.165.160.2.nip.io',
  notificationServiceUrl: 'http://notifications.4.165.160.2.nip.io',
  reviewServiceUrl: 'http://reviews.4.165.160.2.nip.io'
} as const;
