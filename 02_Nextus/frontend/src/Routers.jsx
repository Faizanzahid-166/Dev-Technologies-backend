import App from './App.jsx'

import {Home,
        Registration, VerifyOtpPage, Login, 
         User, Admin,
        // Profile,Listofusers,
        // MyDocs,UploadDoc,Documents,Download,AddSignature,
        // MeetingsPage, UserList,Messages,Chat,
        // PaymentPage,PaymentForm,
        NotFound
       } from './pages/index.js'

import {createBrowserRouter,} from 'react-router'
//import ProtectedRoute from './components/ProtectedRoute.jsx';



const routers = createBrowserRouter([
 {
    path: "/",
    element: <App />,
    children: [
      // { index: true, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
    
       { path: "*", element: <NotFound /> },

       //home
         { path: "/", element: <Home /> },
   
     

      // signup and login
      { path: "/signup", element: <Registration /> },
      { path: "/VerifyOtp", element: <VerifyOtpPage /> },
       { path: "/login", element: <Login /> },

      // // dashboard
      { path: "/dashboard/user-pannel", element: <User /> },
      { path: "/dashboard/admin-pannel", element: <Admin /> },
      
      // //profile
      // { path: "/profile", element: <Profile /> },
      //  { path: "/finduser", element: <Listofusers /> },


      // // doc routes
      // { path: "/documents", 
      //   element: <ProtectedRoute><Documents /></ProtectedRoute>,
      //   children: [
      //   { path: "/documents/list", element: <ProtectedRoute><MyDocs /></ProtectedRoute> },
      //   { path: "/documents/upload", element: <ProtectedRoute><UploadDoc /></ProtectedRoute> },
      //   { path: "/documents/download", element: <ProtectedRoute><Download /></ProtectedRoute> },
      //   { path: "/documents/signature", element: <ProtectedRoute><AddSignature /></ProtectedRoute> },
      //   ] 
      // },

      // //meeting
      //  { path: "/messages", element: <ProtectedRoute><Messages /></ProtectedRoute>,
      //   children:[
      //   { path: "/messages/meetingArangment", element: <ProtectedRoute><MeetingsPage /></ProtectedRoute> },
      //   { path: "/messages/videocall", element: <ProtectedRoute><UserList /></ProtectedRoute> },
      //   { path: "/messages/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
      //   ]
      //  },

      //  { path: "/transactions", element: <PaymentPage /> },
      //  { path: "/realtransactions", element: <PaymentForm /> },
    


    ],
  },
]);

export default routers;
