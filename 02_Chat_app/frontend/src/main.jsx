import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// dark mode
import ThemeProvider from './context/ThemeContextProvider.jsx'

//react-router && routes-files
import { RouterProvider} from "react-router";
import routers from './Routers.jsx'

// react-redux
import { Provider } from 'react-redux';
import { store } from './redux/store.js';





createRoot(document.getElementById('root')).render(
  <StrictMode>
       <Provider store={store}>
       <ThemeProvider>
           <RouterProvider router={routers} />
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
