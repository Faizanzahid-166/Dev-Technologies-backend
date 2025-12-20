import {Applayout} from './layouts/01_index.js'
import {HomePage, ProductdetailsPage,  CartPage, ProductListPage, NotFoundPage, ProductsPage, HotofferePage, BannerdetailsPage, Signup, Login} from './pages/02_index.js'

import { About, Blogs, Comingsoon, Contact, WorkingOnIt, MoneyRefundComingSoon, CategoriesWorkingOn, Services ,AdminPanel} from "./info-pages/infopages.js";

import {createBrowserRouter,} from 'react-router'
import ProtectedRoute from './components/11_ProtectedRoute.jsx';



const routers = createBrowserRouter([
 {
    path: "/",
    element: <Applayout />,
    children: [
      { index: true, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
      { path: "/products", element: <ProtectedRoute><ProductListPage /></ProtectedRoute> },
      { path: "/products/:id", element: <ProtectedRoute><ProductdetailsPage /></ProtectedRoute> },
      { path: "*", element: <NotFoundPage /> },
      { path: "/productspage", element: <ProtectedRoute><ProductsPage /></ProtectedRoute> },
      { path: "/cartpage", element: <ProtectedRoute><CartPage /></ProtectedRoute> },
      { path: "/hotofferepage", element: <ProtectedRoute><HotofferePage /></ProtectedRoute> },
      { path: "/banner/:id", element: <ProtectedRoute><BannerdetailsPage /></ProtectedRoute> },

      // Public routes
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },

      // info-pages routes
       { path: "/about", element: <About /> },
       { path: "/blogs", element: <Blogs /> },
       { path: "/comingsoon", element:  <ProtectedRoute><Comingsoon /></ProtectedRoute> },
       { path: "/contact", element: <Contact /> },
       { path: "/workingonit", element: <WorkingOnIt /> },
       { path: "/moneyrefundcomingsoon", element: <MoneyRefundComingSoon /> },
       { path: "/categoriesworkingon", element: <ProtectedRoute><CategoriesWorkingOn /></ProtectedRoute>  },
       { path:"/services", element:<Services /> },
       { path:"/adminpanel", element:<ProtectedRoute><AdminPanel /></ProtectedRoute> }


 


    ],
  },
]);

export default routers;
