export const environment = {
  production: false,

  // Container-to-container URLs (service discovery via Docker network)
  authServiceUrl: 'http://auth-service:8000',
  userServiceUrl: 'http://user-service:8000',
  orderServiceUrl: 'http://order-service:8000',
  offerServiceUrl: 'http://offer-service:8000',
  paymentServiceUrl: 'http://payment-service:8000',
};
