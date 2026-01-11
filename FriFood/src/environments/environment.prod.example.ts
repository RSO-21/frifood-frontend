export const environment = {
  production: true,
  googleMapsApiKey: '',

  // AKS prod ingress URLs (same as dev but without '-dev')
  apiGatewayUrl: 'http://api.frifood.ass.si',
} as const;
