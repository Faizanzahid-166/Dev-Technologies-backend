import App from './App.jsx'

import {Home,
        Registration, VerifyOtpPage, Login, 
         UserPannel, User,
         Admin,
         ChatPage,

        NotFound
       } from './pages/index.js'

import {createBrowserRouter,} from 'react-router'


const routers = createBrowserRouter([
 {
    path: "/",
    element: <App />,
    children: [
    
       { path: "*", element: <NotFound /> },

       //home
         { path: "/", element: <Home /> },
   
     

      // signup and login
      { path: "/signup", element: <Registration /> },
      { path: "/VerifyOtp", element: <VerifyOtpPage /> },
       { path: "/login", element: <Login /> },

      // // dashboard
      { path: "/dashboard/user-pannel", element: <UserPannel />,
         children: [
          // 1-user-account-page
           { index: true, element: <User /> },
           { path: "/dashboard/user-pannel/info",  element: <User /> }, 

           // 2-chat app
            { path: "/dashboard/user-pannel/chat/ChatPage", element: <ChatPage /> },

         ]
        },
    

      { path: "/dashboard/admin-pannel", element: <Admin /> },


    ],
  },
]);

export default routers;
