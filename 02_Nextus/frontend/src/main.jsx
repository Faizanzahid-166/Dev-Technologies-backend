import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider} from "react-router";
import { AuthProvider } from "./context/Authcontext.jsx";
import { SocketProvider } from "./context/Socketcontext.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import realtimEnv from './api/realtimeEnv.js'

const stripePromise = loadStripe(realtimEnv.STRIPE_PUBLIC_KEY); // replace with your Stripe public key


import routers from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
         <SocketProvider>
          <Elements stripe={stripePromise}>
           <RouterProvider router={routers} />
          </Elements>
         </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
