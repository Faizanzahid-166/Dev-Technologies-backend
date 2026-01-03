const realtimeEnv = {
  backendUrl: String(import.meta.env.VITE_BACKEND_URL), 
  STRIPE_PUBLIC_KEY: String(import.meta.env.VITE_STRIPE_PUBLIC_KEY),
};

export default realtimeEnv;
