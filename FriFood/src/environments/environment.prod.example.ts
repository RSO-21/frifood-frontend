export const environment = {
  production: true,
  googleMapsApiKey: '',

  // AKS prod ingress URLs (same as dev but without '-dev')
  apiGatewayUrl: 'http://api.fri-food.68.210.120.104.nip.io',
  authServiceUrl: 'http://auth.68.210.120.104.nip.io',
  userServiceUrl: 'http://users.68.210.120.104.nip.io',
  orderServiceUrl: 'http://orders.68.210.120.104.nip.io',
  offerServiceUrl: 'http://offers.68.210.120.104.nip.io',
  paymentServiceUrl: 'http://payments.68.210.120.104.nip.io',
  partnerServiceUrl: 'http://partners.68.210.120.104.nip.io',
  notificationServiceUrl: 'http://notifications.68.210.120.104.nip.io',
} as const;
