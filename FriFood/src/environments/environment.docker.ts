export const environment = {
  production: false,

  // Container-to-container URLs (service discovery via Docker network)
  authServiceUrl: 'http://localhost:8005',
  userServiceUrl: 'http://localhost:8004',
  orderServiceUrl: 'http://localhost:8002',
  offerServiceUrl: 'http://localhost:8001',
  paymentServiceUrl: 'http://localhost:8003',
};
