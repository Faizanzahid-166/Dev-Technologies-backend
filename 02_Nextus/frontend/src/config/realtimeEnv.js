const realtimeEnv = {
  backendUrl: String(import.meta.env.VITE_BACKEND_URL), // 👈 clear name
  // backendUrllocal: String(import.meta.env.VITE_API_URL_LOCAL), 
  STRIPE_PUBLIC_KEY: String(import.meta.env.VITE_STRIPE_PUBLIC_KEY),
};

export default realtimeEnv;
